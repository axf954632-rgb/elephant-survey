import COS from 'cos-nodejs-sdk-v5';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ========== 配置区域（需要你手动填写）==========
const config = {
  SecretId: process.env.COS_SECRET_ID || '',
  SecretKey: process.env.COS_SECRET_KEY || '',
  Bucket: process.env.COS_BUCKET || '',
  Region: process.env.COS_REGION || '',
};

// 检查配置
const missing = Object.entries(config).filter(([k, v]) => !v).map(([k]) => k);
if (missing.length > 0) {
  console.error('缺少以下配置项:', missing.join(', '));
  console.error('\n请通过以下方式之一配置：');
  console.error('1. 设置环境变量: COS_SECRET_ID, COS_SECRET_KEY, COS_BUCKET, COS_REGION');
  console.error('2. 直接修改 deploy.js 中的 config 对象\n');
  process.exit(1);
}

const cos = new COS({
  SecretId: config.SecretId,
  SecretKey: config.SecretKey,
});

const distDir = path.resolve(__dirname, 'dist');

// 递归获取所有文件
function getAllFiles(dir, prefix = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const key = prefix ? `${prefix}/${item}` : item;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, key));
    } else {
      files.push({ localPath: fullPath, key });
    }
  }
  return files;
}

async function deploy() {
  console.log('开始扫描 dist 目录...');
  const files = getAllFiles(distDir);
  console.log(`共 ${files.length} 个文件待上传\n`);

  for (const file of files) {
    const contentType = getContentType(file.key);
    try {
      await new Promise((resolve, reject) => {
        cos.putObject(
          {
            Bucket: config.Bucket,
            Region: config.Region,
            Key: file.key,
            Body: fs.createReadStream(file.localPath),
            ContentType: contentType,
          },
          (err, data) => {
            if (err) reject(err);
            else resolve(data);
          }
        );
      });
      console.log(`✓ ${file.key}`);
    } catch (err) {
      console.error(`✗ ${file.key}: ${err.message}`);
    }
  }

  console.log('\n部署完成！');
  console.log(`访问地址: http://${config.Bucket}.cos-website.${config.Region}.myqcloud.com`);
}

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
  };
  return map[ext] || 'application/octet-stream';
}

deploy().catch(console.error);
