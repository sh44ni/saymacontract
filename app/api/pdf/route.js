import puppeteer from "puppeteer";

const getHtmlTemplate = (data) => {
  // Format the date if it exists
  const dateObj = data.date ? new Date(data.date) : new Date();
  const dateStr = dateObj.toLocaleDateString();

  return `
<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100;200;300;400;500;600;700;800;900&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            overflow-x: hidden;
            height: 100vh;
            width: 100%;
            font-family: 'Noto Kufi Arabic', sans-serif !important;
            font-weight: 700 !important;
        }
        main {
            overflow-x: hidden;
            display: flex;
            justify-content: center;
            height: auto;
            width: auto;
        }

        .image-box {
            position: relative;
        }
        .pdfImg{
            display: block;
            max-width: 100%;
            height: auto;
        }

        .image-content{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 92%;
            height: 70%;
            margin-block: 0%;
            font-size: 1.45vw;
        }
        .grid-container {
            margin-top: 2%;
            display: grid;
            grid-template-rows: 1fr 1fr;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
            align-items: start;
            justify-items: start;
            border: .5px solid rgb(0, 0, 0);
            padding: .12rem;
        }

        .kabab-ki-haddi{ margin-top: 3%; }
        ol{ list-style: none; margin-top: 3%; }
        li{ margin-top: 1.5%; }
    </style>
    <title>pdf</title>
</head>
<body dir="rtl">
    <main>
        <div class="image-box">
            <img class="pdfImg" src="https://res.cloudinary.com/umarfarooq/image/upload/v1736434508/sayma/eeuhwyegextpy7vgf4xe.png" alt="">
            
            <div class="image-content">
                <div class="part1">
                    <div class="heading w-full text-center mb-4">
                        <h1 class="lg:text-4xl inline-block px-8 py-4 rounded-lg" style="border: 1px solid;font-size: 2.5vw; font-weight: bolder;">عقد استقدام عاملة منزل</h1>
                    </div>
                    <div class="second-line w-full px-4 py-2 rounded-sm flex items-center justify-between mb-4" style="border: 1px solid;">
                        <div class="right-side-s-line">
                            <p>الطرف الأول : مكتب سيماء الهندسية للتجارة والمقاولات</p>
                        </div>
                        <div class="left-side-s-line">
                            <p>رقم السجل التجاري : 1252596</p>
                        </div>
                    </div>
                </div>
                
                <div class="grid-container px-4 py-2 rounded-sm font-semibold">
                    <div style="width: max-content !important;">الطرف الثاني : ${data.naam || ""}</div>
                    <div>الرقم المدني : ${data.raqam || ""}</div>
                    <div>الرقم الماذونية : ${data.madvia || ""}</div>
                    <div>لعنوان المحافظة : ${data.hafza || ""}</div>
                    <div>ولاية : ${data.walid || ""}</div>
                    <div>الرقم الهاتف : ${data.hatif || ""}</div>
                </div>
                    
                <p class="kabab-ki-haddi font-semibold">بتاريخ :${dateStr} اتفق الطرفان على مايلي :</p>
                    
                <ol class="font-semibold">
                    <li>(1) يلتزم الطرف الأول باستقدام عاملة منزل للطرف الثاني بناءً على طلبه وحسب الشروط التالية <br>
                    قيمه الاستقدام  : ( ${data.mastaqdam || ""} ) ريال عماني والعاملة تدعي ( ${data.aamil || ""} ) : رقم الجواز : ( ${data.khaldal || ""} ) <br>
                    الجنسية : ${data.jins || ""} للعمل لدي الطرف الثاني بمهنه:<br>
                    عامله منزل براتب شهري وقدره: ( ${data.yadfa || ""} ) ريال عماني صافي بدون خصومات</li>
                    <li>(2) يلتزم الطرف الأول بضمان العاملة لمده (180) مائه وثمانون يوم من تاريخ الإستقدام والضمان يشمل رفض العمل بدون <br> سبب اذا ثبت لديها إعاقة لا تمكنها من أداء العمل المتفق عليه - إذا كانت مصابة بأحد الأمراض المعدية أو بمرض مزمن أو <br> مرض عقلي و يثبت العجز الطبي بموجب شهادة طبية صادرة من مستشفي حكومي بالسطنة أو اذا تركت العمل لدي الطرف <br>الثاني</li>
                    <li>(3) يلتزم الطرف الأول باستبدال العاملة خلال فترة الضمان وعلي الطرف الثاني دفع مبلغ خدمات تخليص المعاملات <br> للمكتب أما في حالة طلب ارجاع المبلغ فأنه يتم ارجاع مبلغ الاستقدام المبين في العقد</li>
                    <li>(4) ( الضمان لايشمل الوفاة )</li>
                    <li>(5) يجب توفير المأكل والمسكن المناسب وتوفير العلاج الطبي طوال فتره العمل لديه ،وعدم تشغيل العاملة في <br> تربية الحيوانات والدواجن وغسيل السيارات</li>
                    <li>(6) في حالة إرجاع العاملة اول التنازل او الهروب فإن الطرف الأول غير مسؤول عن مبالغ وزارة العمل ( الماذونية ) <br> وعن الفحوصات الطبية او قيمة ( التأشيرة ( او قيمة البلاغ في مكتب سند او تذكرة السفر في حالات الهروب</li>
                    <li>(7) علي الطرف الثاني دفع رواتب للعاملة ابتداء من أول شهر وكما هو محدد في العقد اعلاه وبدون خصومات للهاتف<br> او النت او الاغراض الشخصية للعاملة</li>
                    <li>(8) يلتزم الطرف الثاني بتحرير عقد عمل من نسختين بينه وبين العامله</li>
                    <li>(9) في حالة استرجاع الكفيل للعاملة وطلب استرجاع المبلغ على المكتب خصم مبلغ وقدره 200 ريال عماني نظير اتعاب المكتب في فترة الضمان</li>
                    <li>(10) لقد قمت بقراءة العقد وعليه اوافق على كل الشروط المدونة</li>
                </ol>

                <div class="flex font-semibold items-center justify-between px-8 mt-24">
                    <div style="border-top: 1px solid ;" class="px-6">الطرف الأول / التوقيع والختم</div>
                    <div style="border-top: 1px solid ;" class="px-6">الطرف الثاني / التوقيع</div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>`;
};

export async function POST(req) {
  try {
    const data = await req.json();

    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const htmlContent = getHtmlTemplate(data);

    await page.setContent(htmlContent, {
      waitUntil: ["load", "networkidle0"],
    });
    
    await page.emulateMediaType("screen");
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      printBackground: true,
      format: "A4",
    });

    await browser.close();

    // Stream the raw PDF back to the client directly
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="contract.pdf"',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to generate PDF." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
