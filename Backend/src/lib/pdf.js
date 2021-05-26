import PdfPrinter from "pdfmake";

export const generatePDFStream = (data) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      {
        image: "public/img/cover/images.jpg",
        width: 500,
      },
      
      {
        text: "I was a salesman 6 months ago, and now I am a professional web developer",
        style: "header",
      },
      {
        text: "Ervins, one of the fresh graduates from Strive School's latest Web Development program, joined the Latvia-based digital agency RevPanda three weeks earlier. Were you to ask him at the beginning of the Covid-19 pandemic what he'd be doing now, the answer would have been very different!Read on below to learn about Ervins's story and how the soft skills he has gained throughout his career thus far, coupled with the technical training received at Strive, has helped him land a job as a web developer. As a salesman in the travel industry, when the pandemic hit, Ervins found himself with a lot of free time. Learning to code was something that rested in the back of Ervins's mind for a while, but he never got around to systematically taking on this challenge. With the unexpected downtime, Ervins decided that instead of sitting at home and rolling his thumbs, now was the perfect opportunity to get on with learning a new skill.Like everyone new to programming, the first thing Ervins did was do some simple Google searches for free resources. He watched Youtube tutorials and read blogposts to learn the basics of coding, and stumbled upon Strive School by chance.'Strive's message was straight to the point. I visited your website, read through everything, and the rest is history!' Says Ervins.As a former salesman, Ervins is cognizant of the advantageous soft skills he brings to the table, but he also appreciated the teamwork skills gained through group projects at Strive.'I was told that there were other more experienced candidates for my current job, but what stood out as more important for the hiring managers was my ability to communicate clearly and work in a team. Soft skills are really important even for software engineering.'Since joining Strive, Ervins has already recommended a friend to join our new cohort And when asked what tips he would give to current and future students at Strive, the wisdom is endless. 'You have to have the ability to overcome adversity,' says Ervins, 'The program was the hardest thing I've done in my life, and you need to be able to cope with feeling overwhelmed.'He then adds, 'On top of that, you should also think about developing your social/ soft skills as in the end of the day, you will be working with other people.'There isn't a typical day on the job for Ervins, and he hasn't stopped learning new programming frameworks to enhance his technical toolbox. Though he learned the MERN stack during his time at Strive, Ervins is now also working on a new project at work using PHP For Ervins, learning doesn't stop here, because after all, this is only the beginning",
        style: "body",
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        lineHeight: 1,
      },
      body: {
        fontSize: 15,
        normal: true,
        lineHeight: 3,
      },
      quote: {
        italics: true,
      },
      small: {
        fontSize: 8,
      },
    },
  };

  const options = {
    // ...
  };

  const pdfReadableStream = printer.createPdfKitDocument(
    docDefinition,
    options
  );
  pdfReadableStream.end();

  return pdfReadableStream;
};
