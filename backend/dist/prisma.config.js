"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("prisma/config");
exports.default = (0, config_1.defineConfig)({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: "postgresql://erp_user:erp_password@127.0.0.1:5433/erp_db?schema=public",
    },
});
//# sourceMappingURL=prisma.config.js.map