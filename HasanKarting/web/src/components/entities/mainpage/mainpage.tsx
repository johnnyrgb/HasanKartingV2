import React from 'react';
import { Carousel, Typography } from 'antd';
import 'antd/dist/antd'
import '../../../styles/mainpage.css';
import img1 from '../../../resources/1.jpg';
import img2 from '../../../resources/2.jpg';
import img3 from '../../../resources/3.jpg';

const { Title, Paragraph } = Typography;

const MainPage = () => {
  return (
    <div className="main-page">
      <Carousel autoplay>
        <div className="carousel-item">
          <img src={img3} alt="Hasan Karting" />
          <div className="carousel-caption">
          </div>
        </div>
        <div className="carousel-item">
          <img src={img1} alt="Hasan Karting" />
          <div className="carousel-caption">
          </div>
        </div>
        <div className="carousel-item">
          <img src={img2} alt="Hasan Karting" />
          <div className="carousel-caption">
          </div>
        </div>
      </Carousel>
      <div className="about-us">
        <Title level={3}>О нас</Title>
        <Paragraph>
          Hasan Karting - это современный картинг-центр, расположенный в самом сердце города. Мы предлагаем лучшие условия для гонщиков всех уровней, от новичков до профессионалов. Наша команда стремится обеспечить безопасность и увлекательный опыт каждому нашему клиенту.
        </Paragraph>
      </div>
    </div>
  );
};

export default MainPage;