const { searchStudents, searchMentors } = require('../utils/helpers');

const search = async (req, res) => {
    const types = ['all', 'student', 'mentor'];
    try {
      const { q, type } = req.query;
      if (!q || !type) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both parameters (q, type).',
        });
      }
      if (!types.includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid value of parameter (type)',
        });
      }
      let results = [];
      if (type === 'all' || type === 'student') {
        const studentResults = await searchStudents(q);
        results = results.concat(studentResults);
      }

      if (type === 'all' || type === 'mentor') {
        const mentorResults = await searchMentors(q);
        results = results.concat(mentorResults);
      }
      res.status(200).json({ success: true, results });
    } catch (err) {
      console.error('Error during search: ', err.message);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { search };
