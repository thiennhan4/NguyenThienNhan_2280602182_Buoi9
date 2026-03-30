const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
exports.registerByEmail = async (req, res) => {
  try {
    const { email, password } = req.body; 
    if (!email || !password) {
      return res.status(400).json({ message: "Cần nhập email và mật khẩu" });
    }

    const existsEmail = await User.findOne({ email });
    if (existsEmail)
      return res.status(400).json({ message: "Email đã tồn tại" });

    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 kí tự" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({ message: "Đăng ký thành công", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
exports.loginByEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Cần nhập email và mật khẩu' });
    }

    const existUser = await User.findOne({ email });
    if (!existUser) return res.status(400).json({ message: 'Email chưa đăng ký' });

    const checkPassword = await bcrypt.compare(password, existUser.password);
    if (!checkPassword) return res.status(400).json({ message: 'Mật khẩu không đúng' });

    const token = jwt.sign(
      { id: existUser._id, role: existUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log(token);
    const { password: _, ...userData } = existUser.toObject();

    res.json({
      token,
      user: userData
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};


exports.logout = async (req, res) => {
  try {
    return res.json({ message: "Đăng xuất thành công" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};