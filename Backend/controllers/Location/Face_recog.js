const { spawn } = require('child_process');
const path = require('path');

function recognizeFace(req, res) {
const pythonScriptPath = 'D:\\location-tracking-app\\Backend\\face_reco\\app.py';

  const pythonProcess = spawn('python', [pythonScriptPath]);

  let responseSent = false;
  let stdoutData = '';
  let stderrData = '';

  pythonProcess.stdout.on('data', (data) => {
    stdoutData += data.toString();
    console.log(`stdout: ${data.toString()}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    stderrData += data.toString();
    console.error(`stderr: ${data.toString()}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python script finished with code ${code}`);
    if (responseSent) return;

    if (code === 0) {
      responseSent = true;
      res.json({
        message: 'Face recognized successfully',
        output: stdoutData.trim(),
      });
    } else {
      responseSent = true;
      res.status(500).json({
        error: 'Failed to recognize face',
        details: stderrData.trim(),
      });
    }
  });

  pythonProcess.on('error', (err) => {
    console.error('Failed to start Python process:', err);
    if (!responseSent) {
      responseSent = true;
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  });
}

module.exports = { recognizeFace };
