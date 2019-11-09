"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
server_1.default.listen(process.env.PORT, function () {
    console.log(`Server listening on port ${process.env.PORT}`);
});
//# sourceMappingURL=app.js.map