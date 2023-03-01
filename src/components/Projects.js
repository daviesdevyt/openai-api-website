import { useState } from "react";
import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_APIKEY,
});
const openai = new OpenAIApi(configuration);

export const Projects = () => {

  async function getTextData(e) {
    setButtonText("Sending...");
    setTextPrompt(textPrompt);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: textPrompt,
    })
    setButtonText("Submit");
    setTextOutput(response.data.choices[0].text)
  }
  async function getImageData(e) {
    setButtonText("Sending...");
    setImagePrompt(imagePrompt);
    try{
      const response = await openai.createImage({
        prompt: imagePrompt,
        n:3,
        size:"1024x1024"
      })
      setImageOutput(response.data.data)
    }
    finally{
      setButtonText("Submit");
    }
  }
  
  const [buttonText, setButtonText] = useState('Submit');
  const [textPrompt, setTextPrompt] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [textOutput, setTextOutput] = useState("Nothing here .....");
  const [imageOutput, setImageOutput] = useState([]);
  
  return (
    <section className="project" id="project">
      <Container id="services">
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <h2>Services</h2>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                  <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                    <Nav.Item>
                      <Nav.Link eventKey="first">Text Gen</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="third">Image Gen</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Tab.Pane eventKey="third">
                    <p>Image generation powered by OpenAI's Image model (Dalle-2)</p>
                      <div className="col-12">
                        <div className="d-flex justify-content-center">
                          <div className="col-8 new-email-bx">
                            <input type="email" placeholder="Describe the image you want to generate" onChange={(e) => setImagePrompt(e.target.value)}/>
                            <button disabled={buttonText != "Submit"} onClick={getImageData} type="button">{buttonText}</button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <Row>
                          {
                            imageOutput.map((img) => {
                              <ProjectCard imgUrl={img.url}/>
                            })
                          }
                        </Row>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="first">
                      <p>Text generation powered bu OpenAI Text model to answer some questions you may have and complete your texts</p>
                      <div className="col-12">
                        <div className="d-flex justify-content-center">
                          <div className="col-8 new-email-bx">
                            <input type="email" placeholder="Ask your questions or write your text halfway" onChange={(e) => setTextPrompt(e.target.value)}/>
                            <button disabled={buttonText != "Submit"} type="button" onClick={getTextData}>{buttonText}</button>
                          </div>
                        </div>
                        <div className="d-flex justify-content-center">
                          <pre style={{fontSize:18}} className="p-4">{textOutput}</pre>
                        </div>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2}></img>
    </section>
  )
}
