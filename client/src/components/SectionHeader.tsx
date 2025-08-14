interface ISectionHeaderProps {
  title: string;
  subTitle: string;
}
const SectionHeader = ({ title, subTitle }: ISectionHeaderProps) => {
  return (
    <>
      <p className="text-center text-warm-gray/80 text-sm md:text-[1rem] tracking-wide lg:text-lg font-semibold uppercase mb-2 md:mb-4 font-the-seasons">
        {subTitle}
      </p>
      <h2 className="text-center text-2xl md:text-3xl lg:text-4xl -mt-2 md:mb-5 font-black uppercase font-the-seasons">
        {title}
      </h2>
    </>
  );
};

export default SectionHeader;
