import React from "react";
import infoImage from "../img/cakeLogin.jpg";

const AboutUs = () => {
  const styles = {
    container: {
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
    },
    imageSection: {
      backgroundImage: `url(${infoImage})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      height: "280px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      marginTop: "5px",
      padding: "20px",
    },
    headingInfo: {
      fontSize: "2.5em",
    },
    heading: {
      marginTop: "20px",
      fontSize: "1.5em",
    },
    footer: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: "#faa4a2",
    },
    footerContent: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    footerSection: {
      width: "45%",
      marginBottom: "10px",
    },
    footerText: {
      margin: "5px 0",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageSection}></div>
      <div style={styles.content}>
        <h1 style={styles.headingInfo}>Informasi</h1>
        <h2 style={styles.heading}>Alamat</h2>
        <p>Jl. Gelatik No 85 Blok F, Tangerang Selatan, Banten</p>

        <h2 style={styles.heading}>Phone</h2>
        <p>+62 81263035236</p>

        <h2 style={styles.heading}>Contact Person</h2>
        <p>WhatsApp: +62 81263035236</p>
        <p>Instagram: @Mecha.id</p>
        <p>Facebook: MechaId</p>

        <h2 style={styles.heading}>Open Hours</h2>
        <p>Senin - Jumat: 8:00 WIB - 17:00 WIB</p>
        <p>Sabtu: 8:00 WIB - 15:00 WIB</p>
      </div>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <p style={styles.footerText}>
              ©Mecha.id 2023. All Rights Reserved.
            </p>
            <p style={styles.footerText}>
              Alamat: Jl. Gelatik No 85 Blok F, Tangerang Selatan, Banten
            </p>
          </div>
          <div style={styles.footerSection}>
            <p style={styles.footerText}>Social Media:</p>
            <p style={styles.footerText}>Facebook: MechaId</p>
            <p style={styles.footerText}>Instagram: Mecha.Id</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
