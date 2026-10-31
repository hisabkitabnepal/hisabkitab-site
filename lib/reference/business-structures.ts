export const reviewed = "7 October 2026";
export const taxYear = "FY 2083/84";

export const slabs: [string, string][] = [
  ["First NPR 10 lakh", "0%"],
  ["Next NPR 5 lakh", "10%"],
  ["Next NPR 10 lakh", "20%"],
  ["Next NPR 15 lakh", "27%"],
  ["Above NPR 40 lakh", "29%"],
];

export const sources: [string, string][] = [
  ["OCR: company registration requirements", "https://ocr.gov.np/pages/registration/"],
  ["Industry and Commerce Office: example firm-document checklist (office-specific)", "https://icolalitpur.bagamati.gov.np/content/37/registration-paper/"],
  ["Department of Commerce: current checklists, including import/export firms", "https://doc.gov.np/category/checklist/"],
  ["IRD: natural-person tax rates, FY 2083/84", "https://ird.gov.np/content/13609/tax-rate-for-natural-persons-for-the/"],
  ["IRD: entity tax rates, FY 2083/84", "https://ird.gov.np/content/13608/income-tax-rate-for-the-entity-for/"],
];

export const faqs = [
  {
    question: "What is the difference between a sole proprietorship and a private limited company in Nepal?",
    answer:
      "A sole proprietorship has one individual owner who is personally liable, while a private limited company is a separate legal entity whose shareholders generally have limited liability. A company also carries more administration: company records, audit and annual filings. Liability protection has limits, including personal guarantees and separate legal obligations.",
  },
  {
    question: "How much tax does a sole proprietor pay in Nepal for FY 2083/84?",
    answer:
      "Under the normal resident sole-proprietor business-income slabs, the first NPR 10 lakh of taxable business income is taxed at 0%, the next NPR 5 lakh at 10%, the next NPR 10 lakh at 20%, the next NPR 15 lakh at 27%, and income above NPR 40 lakh at 29%. Each rate applies only to the income in that band, and taxable profit is not the same as sales.",
  },
  {
    question: "Is the first NPR 10 lakh of business income tax free for every small business?",
    answer:
      "No. The 0% first band is not a blanket exemption for every small business. It applies under the normal resident sole-proprietor business-income slabs. Salary, mixed income, foreign income, special sectors and reliefs need separate assessment, and D-01 fixed tax or D-02 turnover tax may apply instead where eligible.",
  },
  {
    question: "What tax rate does a private limited company pay in Nepal?",
    answer:
      "The general rate for a resident company is 25% of taxable profit. Exceptions apply, including special sectors and concessions, so check the current IRD entity rates for your situation.",
  },
  {
    question: "Which business structure should I choose in Nepal?",
    answer:
      "It depends on how many owners there will be, how much personal liability you can accept, whether you plan to bring in investors, and how much administration you are ready for. A free consultation can help you compare the options for your specific business before you register.",
  },
];