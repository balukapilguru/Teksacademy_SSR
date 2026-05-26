const fs = require('fs');
const path = require('path');
(async () => {
  const envPath = path.join(process.cwd(), '.env');
  const env = fs.readFileSync(envPath, 'utf8');
  const vars = Object.fromEntries(env.split(/\r?\n/).filter(Boolean).map(line => {
    const [key, ...value] = line.split('=');
    return [key.trim(), value.join('=').trim().replace(/^"|"$/g, '')];
  }));
  const baseUrl = vars.NEXT_PUBLIC_TEKS_SSR_API_URL || vars.NEXT_TEKS_SSR_API_URL;
  if (!baseUrl) {
    console.error('NO_BASE_URL');
    process.exit(1);
  }
  const course = 'best-full-stack-python-development-course-training-institute';
  const res = await fetch(`${baseUrl}/api/v1/courses/${course}`);
  const json = await res.json();
  console.log('status', res.status);
  console.log(JSON.stringify(Object.keys(json?.data || {}), null, 2));
  console.log('excel keys', !!json?.data?.excel, !!json?.data?.Excel, !!json?.data?.excelWithTeksacademy, !!json?.data?.excelWithTeksversity);
  console.log('career keys', !!json?.data?.careerServices, !!json?.data?.careerService, !!json?.data?.career);
  console.log('sample excel', JSON.stringify(json?.data?.excel || json?.data?.Excel || json?.data?.excelWithTeksacademy || json?.data?.excelWithTeksversity, null, 2).slice(0, 1000));
  console.log('sample career', JSON.stringify(json?.data?.careerServices || json?.data?.careerService || json?.data?.career, null, 2).slice(0, 1000));
})();
