import "./About.css";

const About = () => {
  return (
    <div className="principal">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card2">
          <img src={process.env.PUBLIC_URL + '/assets/images/luxury-car.jpg'} alt="luxury-car"  />
            <div className="card-body">
              <h2 className="card-title">Bienvenido a Kite Rental: El Arte del Lujo en Cada Viaje</h2>
              <h4 className="card-subtitle mb-3 text-muted">Descubre una Experiencia de Conducción Excepcional</h4>
              <p className="card-text">Bienvenido a Kite Rental, tu destino definitivo para experimentar el lujo en cada viaje. En Kite Rental, entendemos que el viajar no se trata solo de llegar de un lugar a otro, sino de hacerlo con estilo, elegancia y distinción.
                Sumérgete en nuestro exclusivo mundo de automóviles de lujo, donde cada vehículo es una obra maestra de ingeniería y diseño. Desde elegantes sedanes hasta potentes deportivos, nuestra flota está meticulosamente seleccionada para satisfacer los gustos más exigentes de nuestra selecta clientela.
                En Kite Rental, no solo ofrecemos automóviles de lujo; ofrecemos una experiencia inigualable. Desde el momento en que te acercas a nuestra puerta hasta que emprendes tu viaje, nuestro compromiso es brindarte un servicio impecable y atención personalizada.
                Ya sea que estés planeando una escapada de fin de semana o un viaje de negocios, en Kite Rental, cada detalle se cuida con esmero para garantizar que tu experiencia sea inolvidable.
                Descubre el placer de conducir con distinción. Descubre Kite Rental.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default About;