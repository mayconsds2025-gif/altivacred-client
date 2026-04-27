import React from "react";

type CardBaseProps = {
  logo?: string;
  title?: string;
  subtitle?: string | null;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  small?: boolean;
};

const CardBase: React.FC<CardBaseProps> = ({
  logo,
  title,
  subtitle = null,
  badge = null,
  children,
  className = "",
  small = false,
}) => {
  return (
    <div
      className={`
        relative 
        bg-white 
        rounded-2xl 
        shadow 
        p-6 
        box-border
        w-full 
        ${small ? "max-w-[360px]" : "max-w-[420px]"}
        mx-auto
        ${className}
      `}
    >
      {/* badge no topo direito */}
      {badge && (
        <div className="absolute right-4 -top-4 bg-white text-sm px-3 py-1.5 rounded-md shadow-md flex items-center gap-2">
          {badge}
        </div>
      )}

      {/* header */}
      <div className="flex items-center gap-4 mb-4">
        {logo && (
          <img
            src={logo}
            className="w-20 h-auto object-contain"
            alt="logo"
          />
        )}

        <div className="flex flex-col">
          {title && <h2 className="text-lg font-bold text-[#0A2540]">{title}</h2>}
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
      </div>

      {/* conteúdo */}
      <div className="mt-2 w-full">{children}</div>
    </div>
  );
};

export default CardBase;
