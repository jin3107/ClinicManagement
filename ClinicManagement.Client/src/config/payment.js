export const CLINIC_BANK_ACCOUNT = {
  bankBin: "970422",
  accountNumber: "0948637759",
  accountName: "HUYNH TAN CHUONG",
};

const stripDiacritics = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

export const buildVietQrUrl = (amount, note) => {
  const { bankBin, accountNumber, accountName } = CLINIC_BANK_ACCOUNT;
  const params = new URLSearchParams({
    amount: String(Math.max(0, Math.round(Number(amount) || 0))),
    addInfo: stripDiacritics(note),
    accountName: stripDiacritics(accountName),
  });
  return `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact2.png?${params.toString()}`;
};
