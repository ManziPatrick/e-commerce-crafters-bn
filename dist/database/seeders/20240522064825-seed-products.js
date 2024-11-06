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
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D";
            const imageUrl2 = "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL3BmLXMxMDgtcG0tNDExMy1tb2NrdXAuanBn.jpg";
            const imageUrl3 = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D";
            const imageUrl4 = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D";
            // const imageUrl = 'http://pluspng.com/img-png/nike-running-shoes-png-image-transparent-free-download-1200.png';
            const [vendors] = yield queryInterface.sequelize.query(`
      SELECT "vendorId" 
      FROM "Vendors" 
      ORDER BY "createdAt" DESC 
      LIMIT 3;
    `);
            const products = vendors.map((vendor) => ({
                productId: uuidv4(),
                // @ts-ignore
                vendorId: vendor.vendorId,
                name: "nike shoes",
                image: JSON.stringify([imageUrl, imageUrl2, imageUrl3, imageUrl4]),
                description: "These are nike shoes.",
                discount: 2,
                price: 12000,
                quantity: 100,
                category: "Shoes",
                createdAt: new Date(),
                updatedAt: new Date(),
                expired: false,
                available: true,
            }));
            yield queryInterface.bulkInsert("Products", products, {});
        });
    },
    down(queryInterface, Sequelize) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            yield queryInterface.bulkDelete("Products", null, {});
        });
    },
};
