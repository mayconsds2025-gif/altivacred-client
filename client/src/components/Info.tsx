import React from "react";

type InfoProps = {
  label: string;
  value: string | number;
};

const Info: React.FC<InfoProps> = ({ label, value }) => {
  return (
    <div className="bg-gray-100 border text-center py-3 rounded-xl">
      <p className="text-xs text-gray-600">{label}</p>
      <p className="text-base font-bold text-[#2563EB]">{value}</p>
    </div>
  );
};

export default Info;
