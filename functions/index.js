const admin = require("firebase-admin");
admin.initializeApp();

exports.adDoctor = require("./adDoctor").adDoctor;
exports.adGapAnalyzer = require("./adGapAnalyzer").adGapAnalyzer;
exports.performancePredictor = require("./performancePredictor").performancePredictor;
