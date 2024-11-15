import React from 'react';
import '../../style/style.css';
import image from '../../assets/images/niger_lol.jpg';

const AboutUs1 = () => (
  <section className="about_us_container">
    <div className="about_us container">
      <div className="img_info">
        <img className="img" src={image} alt="About Us" />
        <div className="info_all">
          {["Мероприятия", "Часы", "Волонтеры", "Достижения"].map((title, index) => {
            let description;
            switch (title) {
              case "Мероприятия":
                description = "Мы организовали более 50 мероприятий, оказывая необходимую поддержку местным организациям и создавая возможности для волонтеров, чтобы изменить ситуацию к лучшему.";
                break;
              case "Часы":
                description = "Наши волонтеры в совокупности внесли более 1000 часов работы, демонстрируя свою приверженность улучшению нашего сообщества.";
                break;
              case "Волонтеры":
                description = "С момента нашего создания мы успешно связали более 500 волонтеров с различными общественными мероприятиями, способствуя духу сотрудничества и поддержки.";
                break;
              case "Достижения":
                description = "Мы отмечаем достижения наших волонтеров с 25 признанными достижениями, которые подчеркивают их преданность и влияние.";
                break;
              default:
                description = "";
            }
            return (
              <div className="info" key={index}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default AboutUs1;
