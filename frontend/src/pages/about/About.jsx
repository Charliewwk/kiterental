import { useGlobal } from "../../context/globalContext/GlobalContext";

const About = () => {
  const { translations } = useGlobal();

  return (
    <div className="container d-flex justify-content-center">
      <div className="card card-limit">
        <div className="card-header">{translations.aboutPage.title}</div>
        <div className="card-body d-flex flex-column ">
          <h5 className="card-title">{translations.aboutPage.subtitle}</h5>
          <p className="card-text">{translations.aboutPage.text}.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
