const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    default: false,
  },
  level: {
    type: Number,
    default: 1,
  },
});

UserSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model('User', UserSchema);
