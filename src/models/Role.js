const mongoose =  require ("mongoose");
const RoleSchema = new mongoose.Schema({
    // role_id: {
    //     type: Number,
    //     required: true,
    // }
    role_name: {
        type: String,
        required: true,
        permissions: [],
    },
},
    { timestamps: true }
);


module.exports = mongoose.model("role", RoleSchema); 