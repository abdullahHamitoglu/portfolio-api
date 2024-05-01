import { Router } from "express";
import Skill, { ISkill } from "../database/models/Skills";
import { authenticateToken } from "../controllers/authToken";

const router = Router();

// create skill 
router.post("/", authenticateToken, async (req, res) => {
    console.log(req.body);

    try {
        if (!req.body.title) {
            res.status(401).json({
                status: 'error',
                message: 'title is required',
                data: null,
            })
        }
        const skill: ISkill = new Skill(req.body);
        await skill.save();
        res.json({
            status: "success",
            result: {
                id: skill._id,
                title: skill.title,
            },
            message: "Skill created successfully",
        });
    } catch (error) {
        console.log(error);
    }
});

// get all skills
router.get("/", async (req, res) => {
    const skills: ISkill[] = await Skill.find();
    res.json({
        status: "success",
        data: skills.map(skill => ({
            id: skill._id,
            title: skill.title,
        })),
        message: "Skills fetched successfully",
    });
});

// get skill by id

router.get("/:id", async (req, res) => {
    const skill = await Skill.findById(req.params.id);
    res.json({
        status: "success",
        data: skill,
    });
});

// delete skill by id
router.delete("/:id", authenticateToken, async (req, res) => {
    const skill: any = await Skill.findByIdAndDelete(req.params.id);

    res.json({
        status: "success",
        data: {
            id: skill._id,
            title: skill.title,
        },
        message: "Skill deleted successfully",
    });
});

// update skill by id
router.put("/:id", authenticateToken, async (req, res) => {
    const skill: any = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({
        status: "success",
        data: {
            id: skill._id,
            title: skill.title,
        },
    });
});

export const SkillsRouter = router;
