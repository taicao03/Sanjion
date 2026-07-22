import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Read .env.local for Supabase & Gemini API Keys
const envPath = path.join(projectRoot, '.env.local');
let apiKey = '';
let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const matchKey = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
  if (matchKey) apiKey = matchKey[1].split(',')[0].trim();

  const matchUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/);
  if (matchUrl) supabaseUrl = matchUrl[1].trim();

  const matchAnon = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);
  if (matchAnon) supabaseKey = matchAnon[1].trim();
}

console.log('🚀 Đang khởi chạy Script Gemini 2.0 AI Direct Supabase Sync Generator...');

const categories = [
  { id: '10000000-0000-0000-0000-000000000001', name: 'JavaScript Core' },
  { id: '10000000-0000-0000-0000-000000000002', name: 'ReactJS' },
  { id: '10000000-0000-0000-0000-000000000003', name: 'HTML & CSS' },
  { id: '10000000-0000-0000-0000-000000000004', name: 'Web Performance & Security' },
  { id: '10000000-0000-0000-0000-000000000005', name: 'Frontend System Design' },
];

const difficulties = ['EASY', 'MEDIUM', 'HARD', 'EXPERT'];
const types = ['CODING_PRACTICE', 'MULTIPLE_CHOICE', 'THEORY'];

async function generateBatchDirect() {
  const ai = new GoogleGenAI({ apiKey: apiKey.startsWith('AIzaSy') ? apiKey : 'AIzaSy_demo_fallback' });
  const generatedObjects = [];
  const sqlInserts = [];

  console.log(`📦 Bắt đầu sinh bài tập Sanjion và TỰ ĐỘNG ĐẨY TRỰC TIẾP LÊN SUPABASE CLOUD DATABASE...`);

  for (let i = 0; i < 5; i++) {
    const cat = categories[i % categories.length];
    const diff = difficulties[i % difficulties.length];
    const type = types[i % types.length];

    console.log(`[${i + 1}/5] Gemini 2.0 AI đang sáng tạo: ${cat.name} (${diff} - ${type})...`);

    const prompt = `
Tạo 1 câu hỏi Sanjion Frontend MỚI (Random Seed: ${Math.random()}):
- Chủ đề: ${cat.name}
- Độ khó: ${diff}
- Loại bài: ${type}

Trả về JSON duy nhất (không bọc trong \`\`\`json):
{
  "title": "<Tiêu đề câu hỏi Sanjion>",
  "content": "<Đề bài Markdown chi tiết>",
  "explanation": "<Lời giải chi tiết và Best Practice>",
  "options": [ { "id": "a", "text": "Đáp án A", "is_correct": false }, { "id": "b", "text": "Đáp án B", "is_correct": true } ],
  "starterCode": "function solution() { }",
  "testCases": [ { "input": "solution()", "expected": true } ],
  "points": ${diff === 'EASY' ? 10 : diff === 'MEDIUM' ? 15 : diff === 'HARD' ? 25 : 35}
}
`;

    try {
      let text = '';
      if (apiKey.startsWith('AIzaSy')) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
        });
        text = response.text || '';
      }

      let parsed;
      if (text) {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } else {
        parsed = {
          title: `[${diff}] Sanjion AI ${cat.name}: Bài tập chuyên sâu #${Date.now().toString().slice(-4)}`,
          content: `Phân tích và triển khai bài tập ${cat.name} cấp độ ${diff}.`,
          explanation: `Lời giải mẫu chuẩn Senior Sanjioner cho bài tập ${cat.name}.`,
          starterCode: `function solution() {\n  // Code solution tại đây\n}`,
          testCases: [{ input: 'return true;', expected: true }],
          points: diff === 'EASY' ? 10 : diff === 'MEDIUM' ? 15 : diff === 'HARD' ? 25 : 35,
        };
      }

      const uniqueHash = Math.floor(1000 + Math.random() * 9000);
      const slugTitle = parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const uniqueSlug = `cli-${slugTitle}-${uniqueHash}`;

      const qObj = {
        category_id: cat.id,
        title: parsed.title,
        slug: uniqueSlug,
        difficulty: diff,
        type: type,
        content: parsed.content,
        explanation: parsed.explanation,
        options: parsed.options || null,
        starter_code: parsed.starterCode || null,
        test_cases: parsed.testCases || null,
        points: parsed.points || 20,
        view_count: 1,
      };

      generatedObjects.push(qObj);

      const sql = `
INSERT INTO questions (category_id, title, slug, difficulty, type, content, explanation, options, starter_code, test_cases, points) VALUES (
  '${cat.id}',
  '${parsed.title.replace(/'/g, "''")}',
  '${uniqueSlug}',
  '${diff}',
  '${type}',
  '${parsed.content.replace(/'/g, "''")}',
  '${parsed.explanation.replace(/'/g, "''")}',
  ${parsed.options ? `'${JSON.stringify(parsed.options).replace(/'/g, "''")}'` : 'NULL'},
  ${parsed.starterCode ? `'${parsed.starterCode.replace(/'/g, "''")}'` : 'NULL'},
  ${parsed.testCases ? `'${JSON.stringify(parsed.testCases).replace(/'/g, "''")}'` : 'NULL'},
  ${parsed.points || 20}
) ON CONFLICT (slug) DO NOTHING;`;
      sqlInserts.push(sql);

    } catch (err) {
      console.warn(`Lỗi khi tạo câu hỏi #${i + 1}:`, err.message);
    }
  }

  // Direct Push to Supabase Cloud REST API using native fetch
  if (supabaseUrl && supabaseKey && generatedObjects.length > 0) {
    try {
      console.log('🟢 Đang tự động đẩy trực tiếp dữ liệu câu hỏi lên Supabase Cloud REST API...');
      const response = await fetch(`${supabaseUrl}/rest/v1/questions`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(generatedObjects)
      });

      if (response.ok) {
        console.log('🎉 THÀNH CÔNG 100%! CÂU HỎI MỚI ĐÃ ĐƯỢC TỰ ĐỘNG LƯU TRỰC TIẾP VÀO DATABASE CLOUD SUPABASE!');
      } else {
        const errText = await response.text();
        console.warn('⚠️ Supabase REST API Reponse:', errText);
      }
    } catch (e) {
      console.warn('Supabase Direct Push Error:', e);
    }
  }

  // Backup to seed.sql
  const seedPath = path.join(projectRoot, 'supabase', 'seed.sql');
  if (sqlInserts.length > 0) {
    fs.appendFileSync(seedPath, '\n\n-- DIRECT AI GENERATED QUESTIONS --\n' + sqlInserts.join('\n'));
    console.log(`📝 Đã ghi nhận bản sao lưu backup vào file supabase/seed.sql.`);
  }
}

generateBatchDirect();
