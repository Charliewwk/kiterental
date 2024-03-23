import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './home.css'

const CategoryWithTooltip = ({ title }) => {

  const initials = title.split(' ').map(word => word[0]).join('');
  const renderCategoryTooltip = (props) => (
    <Tooltip id="button-category-tooltip" {...props}>
      {title}
  </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 100, hide: 100 }}
      overlay={renderCategoryTooltip}
    >
      <Button style={{ 
        backgroundColor: 'transparent', 
        border: 'none', 
        color: 'inherit',
        textDecoration: 'none',
        padding: 0,
        margin: 0
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ width: '32px', height: '32px' }}>
          <ellipse cx="50" cy="50" rx="35" ry="25" fill="none" stroke="currentColor" strokeWidth="3"/>
          <text x="50" y="52" fill="currentColor" textAnchor="middle" dominantBaseline="middle" style={{ fontWeight: 'bold', fontSize: '26px' }}>{initials}</text>
        </svg>
      </Button>
    </OverlayTrigger>

  );
};

const UserWithTooltip = ({ name }) => {

  const initials = name.split(' ').map(word => word[0]).join('');
  const renderUserTooltip = (props) => (
    <Tooltip id="button-user-tooltip" {...props}>
      {name}
  </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="right"
      delay={{ show: 100, hide: 100 }}
      overlay={renderUserTooltip}
    >
      <Button style={{ 
        backgroundColor: 'transparent', 
        border: 'none', 
        color: 'inherit',
        textDecoration: 'none',
        padding: 0,
        margin: 0
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style={{ width: '32px', height: '32px' }}>
          <ellipse cx="50" cy="50" rx="35" ry="35" fill="#c6e6ee" stroke="#87aedc" strokeWidth="3"/>
          <text x="50" y="52" fill="currentColor" textAnchor="middle" dominantBaseline="middle" style={{ fontWeight: 'bold', fontSize: '36px' }}>{initials}</text>
        </svg>
      </Button>
    </OverlayTrigger>

  );
};

const Home = () => {
  return (

    <Container>
      <Row xs="auto">
        <Col>
          Categoría SVG dinámico
          <CategoryWithTooltip title="Tipo de Pastillas"/>
          <CategoryWithTooltip title="Escala"/>
          <CategoryWithTooltip title="Tipo de Puente"/>
          <CategoryWithTooltip title="Tipo de Cuerpo"/>
          <CategoryWithTooltip title="Acabado del Cuerpo"/>
          <CategoryWithTooltip title="Tipo de Trémolo"/>
          <CategoryWithTooltip title="Tipo de Afinación"/>
          <CategoryWithTooltip title="Sistema de Electrónica"/>
        </Col>
      </Row>
      <Row xs="auto">
        <Col>
          Nombre Apellido SVG dinámico
          <UserWithTooltip name="Christian Fernández"/>
          <UserWithTooltip name="Romina Mazzuco"/>
          <UserWithTooltip name="Martín"/>
          <UserWithTooltip name="Iván"/>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
