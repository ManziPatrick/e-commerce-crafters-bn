"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhook = exports.checkout = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
const paymentService_1 = require("../services/paymentService");
dotenv_1.default.config();
const stripe = new stripe_1.default(`${process.env.STRIPE_SECRET_KEY}`);
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const order = yield (0, paymentService_1.findOrderById)(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const line_items = yield Promise.all(order.products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const productDetails = yield (0, paymentService_1.findProductById)(item.productId);
            const unit_amount = Math.round(productDetails.price * 100);
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: productDetails === null || productDetails === void 0 ? void 0 : productDetails.name,
                        images: [productDetails === null || productDetails === void 0 ? void 0 : productDetails.image[0]],
                    },
                    unit_amount: unit_amount,
                },
                quantity: item.quantity,
            };
        })));
        const session = yield stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: process.env.SUCCESS_PAYMENT_URL,
            cancel_url: process.env.CANCEL_PAYMENT_URL,
            metadata: {
                orderId: orderId,
            },
        });
        res.status(200).json({ url: session.url });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.checkout = checkout;
const webhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.WEBHOOK_SECRET_KEY;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    }
    catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            try {
                const lineItems = yield stripe.checkout.sessions.listLineItems(session.id);
                const orderId = session.metadata.orderId;
                const order = yield (0, paymentService_1.findOrderById)(orderId);
                if (order) {
                    order.status = "paid";
                    yield order.save();
                }
                else {
                    console.error("Order not found:", orderId);
                }
            }
            catch (err) {
                console.error("Error processing session completed event:", err);
            }
            break;
        case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            console.log("Payment Intent succeeded: ", paymentIntent);
            break;
        case "payment_method.attached":
            const paymentMethod = event.data.object;
            console.log("Payment Method attached: ", paymentMethod);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
});
exports.webhook = webhook;
