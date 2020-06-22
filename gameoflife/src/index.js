import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ButtonToolbar, Button, ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { Card, ListGroup } from 'react-bootstrap';

class Box extends React.Component {
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  }

  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.id}
        onClick={this.selectBox}
      />
    );
  }
}

class Grid extends React.Component {
  render() {
    const width = (this.props.cols * 14) + 1;
    var rowsArr = [];
    var boxClass = "";
    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j;

        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        );
      }
    }
    return (
      <div className="grid" style={{ width: width }}>
        {rowsArr}

      </div>
    );
  }
}
class Buttons extends React.Component {

  handleSelect = (evt) => {
    this.props.gridSize(evt);
  }
  render() {
    return (
      <div className="center">
        <ButtonToolbar>
          <ButtonGroup>
            <Button className="btn btn-default" onClick={this.props.playButton}>
              Play
          </Button>
            <Button className="btn btn-default" onClick={this.props.pauseButton}>
              Pause
          </Button>
            <Button className="btn btn-default" onClick={this.props.clear}>
              Clear
          </Button>
            <Button className="btn btn-default" onClick={this.props.slow}>
              Slow
          </Button>
            <Button className="btn btn-default" onClick={this.props.fast}>
              Fast
          </Button>
            <Button className="btn btn-default" onClick={this.props.seed}>
              Seed
          </Button>

            <DropdownButton as={ButtonGroup}
              title="Grid Size"
              id="size-menu"
              onSelect={this.handleSelect}>
              <Dropdown.Item eventKey="1">20x10</Dropdown.Item>
              <Dropdown.Item eventKey="2">50x30</Dropdown.Item>
              <Dropdown.Item eventKey="3">70x50</Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>

        </ButtonToolbar>
      </div>

    )
  }
}
class Main extends React.Component {
  constructor() {
    super();
    this.speed = 100;
    this.rows = 30;
    this.cols = 50;

    this.state = {
      generation: 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    }
  }
  selectBox = (row, col) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy
    })
  }
  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      gridFull: gridCopy
    });
  }
  playButton = () => {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(this.play, this.speed);
  }
  pauseButton = () => {
    clearInterval(this.intervalId);
  }
  slow = () => {
    this.speed = 1000;
    this.playButton();
  }
  fast = () => {
    this.speed = 100;
    this.playButton();
  }
  clear = () => {
    var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.setState({
      gridFull: grid,
      generation: 0
    })
  }

  gridSize = (size) => {
    switch (size) {
      case "1":
        this.cols = 20;
        this.rows = 10;
        break;
      case "2":
        this.cols = 50;
        this.rows = 30;
        break;
      default:
        this.cols = 70;
        this.rows = 50;
    }
    this.clear();
  }

  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull)

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0;
        if (i > 0) if (g[i - 1][j]) count++;
        if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
        if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
        if (j < this.cols - 1) if (g[i][j + 1]) count++;
        if (j > 0) if (g[i][j - 1]) count++;
        if (i < this.rows - 1) if (g[i + 1][j]) count++;
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
        if (i < this.rows - 1 && j < this.cols - 1) if (g[i + 1][j + 1]) count++;
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
      }
    }
    this.setState({
      gridFull: g2,
      generation: this.state.generation + 1
    });


  }
  componentDidMount() {
    this.seed();
    this.playButton();
  }

  render() {
    return (
      <div>
        <h1>The Game of Life</h1>
        <Buttons
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          seed={this.seed}
          gridSize={this.gridSize}
        />
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <div>

          <div className="center">
          <Card style={{ width: '30rem' }}>
              <Card.Img variant="top" src="https://static01.nyt.com/images/2020/04/18/obituaries/14Conway1/merlin_171560415_a372e14d-1b58-4837-bc68-e474efc320a0-jumbo.jpg?quality=90&auto=webp" />
              <Card.Body>
                <Card.Title>Inventor of the Game of Life</Card.Title>
                <Card.Text>
                English-born Cambridge (and later Princeton) mathematician John Conway.  (26 December 1937 – 11 April 2020)
                </Card.Text>
                <Button variant="primary" href="https://www.economist.com/obituary/2020/04/23/john-conway-died-on-april-11th">Learn More about Professor John Conway</Button>
              </Card.Body>
            </Card>
            <h2>The Rules!!</h2>
            <Card style={{ width: '30rem' }}>
              <Card.Header>For a space that is 'populated':</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>Each cell with one or no neighbors dies, as if by solitude.</ListGroup.Item>
                <ListGroup.Item>Each cell with four or more neighbors dies, as if by overpopulation.</ListGroup.Item>
                <ListGroup.Item>Each cell with two or three neighbors survives.</ListGroup.Item>
              </ListGroup>
            </Card>

            <Card style={{ width: '30rem' }}>
              <Card.Header>For a space that is 'empty' or 'unpopulated':</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>Each cell with three neighbors becomes populated.</ListGroup.Item>
              </ListGroup>
            </Card>

          </div>
        </div>
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
}
function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}
ReactDOM.render(<Main />, document.getElementById('root')
);


