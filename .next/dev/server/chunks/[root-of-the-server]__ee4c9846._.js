module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/lib/db.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
let pool;
const config = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
} : {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'expense_tracker',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432
};
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    // In development mode, stick the pool in a global variable
    // so we don't restart it every time the module reloads.
    if (!/*TURBOPACK member replacement*/ __turbopack_context__.g.pool) {
        console.log('[DB] Initializing new pool (dev)');
        /*TURBOPACK member replacement*/ __turbopack_context__.g.pool = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["Pool"](config);
    }
    pool = /*TURBOPACK member replacement*/ __turbopack_context__.g.pool;
}
const __TURBOPACK__default__export__ = pool;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/authorize.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withAuth",
    ()=>withAuth
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$jsonwebtoken__$5b$external$5d$__$28$jsonwebtoken$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$jsonwebtoken$29$__ = __turbopack_context__.i("[externals]/jsonwebtoken [external] (jsonwebtoken, cjs, [project]/node_modules/jsonwebtoken)");
;
function withAuth(handler) {
    return async (req, res)=>{
        console.log(`[Auth Check] Verifying token for: ${req.method} ${req.url}`);
        const token = req.headers.authorization;
        if (!token) {
            console.log('[Auth Check] Failed: No token provided');
            return res.status(401).json({
                error: 'Access Denied: No Token Provided'
            });
        }
        try {
            const tokenString = token.split(' ')[1];
            if (!tokenString) throw new Error('Malformed Token');
            const verified = __TURBOPACK__imported__module__$5b$externals$5d2f$jsonwebtoken__$5b$external$5d$__$28$jsonwebtoken$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$jsonwebtoken$29$__["default"].verify(tokenString, process.env.JWT_SECRET || 'secret_key_123');
            req.user = verified;
            return handler(req, res);
        } catch (err) {
            console.log('[Auth Check] Failed: Invalid token');
            return res.status(400).json({
                error: 'Invalid Token'
            });
        }
    };
}
}),
"[project]/src/pages/api/budget/status.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$authorize$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/authorize.js [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            message: 'Method not allowed'
        });
    }
    try {
        const { month } = req.query;
        const user_id = req.user.id;
        if (!month) {
            return res.status(400).json({
                error: 'Month parameter is required'
            });
        }
        const dbMonth = month.length === 7 ? `${month}-01` : month;
        const budgetRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].query('SELECT * FROM budgets WHERE user_id = $1 AND month = $2', [
            user_id,
            dbMonth
        ]);
        if (budgetRes.rows.length === 0) {
            return res.json({
                notSet: true
            });
        }
        const budget = budgetRes.rows[0];
        const totalBudget = Number(budget.monthly_budget);
        const startDate = new Date(dbMonth);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
        const endDateStr = endDate.toISOString().split('T')[0];
        const spentRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"].query(`SELECT SUM(amount) as total FROM transactions 
             WHERE user_id = $1 AND txn_date >= $2 AND txn_date < $3`, [
            user_id,
            dbMonth,
            endDateStr
        ]);
        const totalSpent = Number(spentRes.rows[0].total) || 0;
        const remaining = totalBudget - totalSpent;
        let alert = null;
        let alertLevel = 'none';
        if (totalSpent >= 0.9 * totalBudget) {
            alert = "⚠️ Budget almost exhausted! You have spent over 90%.";
            alertLevel = 'danger';
        } else if (totalSpent >= 0.7 * totalBudget) {
            alert = "⚠️ You're crossing safe spending (70% used).";
            alertLevel = 'warning';
        }
        res.json({
            monthly_budget: totalBudget,
            savings_target: Number(budget.savings_target),
            total_spent: totalSpent,
            remaining: remaining,
            alert,
            alert_level: alertLevel
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            error: 'Server Error'
        });
    }
}
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$authorize$2e$js__$5b$api$5d$__$28$ecmascript$29$__["withAuth"])(handler);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ee4c9846._.js.map