import { Request, Response } from "express";
import Subscription from "../database/models/subscription";
import User from "../database/models/user";
import { registerSubscription, unsubscribe } from "../services/subscription.service";


export const saveSubscription = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user: any = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (email) {
            const duplicate: any = await Subscription.findOne({ where: { email } });
            if (duplicate) {
                return res.status(403).json({ message: "Email already exists" });
            }
        }

        const subscription = await registerSubscription(email)
        if (!subscription) {
            return res.status(500).json({ error: "Failed to save subscription" })
        }
        return res.status(201).json({ message: "Subscription Created", data: subscription })

    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const deleteSubscription = async (req: Request, res: Response) => {
    const { email } = req.body;
  try {
    await unsubscribe(email)
    res.status(200).json({ message: "Subcription deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
