import React, { Component, Fragment } from "react";
import Card from "./Card.js";

class Deck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      numberOfCardsByIndex: 3,
    };
  }

  componentDidMount() {
    const newCards = [];

    for (let i = 0; i <= this.state.numberOfCardsByIndex; i++) {
      newCards.push(
        <Card
          picsum={`https://picsum.photos/600/${350 + i}`}
          key={i}
          myId={`card-${i}`}
        />
      );
    }

    this.setState({ cards: newCards }, () => {
      let imgWidthAsPercentage = 50;
      imgWidthAsPercentage = window.innerWidth < 768 ? 100 : imgWidthAsPercentage;
      let navButtonsPlacementAsPercentage = 60;
      navButtonsPlacementAsPercentage = window.innerWidth < 768 ? 100 : navButtonsPlacementAsPercentage;

      this.newWidth = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
        ? (imgWidthAsPercentage / 100) * window.screen.width
        : (imgWidthAsPercentage / 100) * window.innerWidth;

      this.viewPort.style.width = `${this.newWidth}px`;
      this.navButtonsContainer.style.width = `${navButtonsPlacementAsPercentage}vw`;
      this.navButtonNext.style.width = `${(this.newWidth / 2) * 0.30}px`;
      this.navButtonPrev.style.width = `${(this.newWidth / 2 * 0.30)}px`;

      window.addEventListener("resize", () => {
        imgWidthAsPercentage = 50;
        imgWidthAsPercentage = window.innerWidth < 768 ? 100 : imgWidthAsPercentage;
        navButtonsPlacementAsPercentage = 60;
        navButtonsPlacementAsPercentage = window.innerWidth < 768 ? 100 : navButtonsPlacementAsPercentage;

        this.newWidth = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
          ? (imgWidthAsPercentage / 100) * window.screen.width
          : (imgWidthAsPercentage / 100) * window.innerWidth;

        this.viewPort.style.width = `${this.newWidth}px`;
        this.navButtonsContainer.style.width = `${navButtonsPlacementAsPercentage}vw`;
        this.navButtonNext.style.width = `${(this.newWidth / 2) * 0.30}px`;
        this.navButtonPrev.style.width = `${(this.newWidth / 2 * 0.30)}px`;

        this.orderCards();

        this.rightBoundary =
          parseFloat(
            this.images.children[this.state.numberOfCardsByIndex].style.left
          ) + this.newWidth;
        this.leftBoundary =
          parseFloat(this.images.children[0].style.left) - this.newWidth;

        for (let i = 0; i < this.images.children.length; i++) {
          this.lastPositions[i] = parseFloat(this.images.children[i].style.left);
        }
      });

      this.orderCards();

      /* ***************************** Touch navigation ******************* */

      this.startTouchPostition = 0.0;
      this.updatedPosition = 0.0;
      this.speedModifier = 0.8;
      this.lastPositions = [];
      //console.log(this.images.children[0].style);
      //console.log(this.state.numberOfCardsByIndex);
      this.rightBoundary =
        parseFloat(
          this.images.children[this.state.numberOfCardsByIndex].style.left
        ) + this.newWidth;
      this.leftBoundary =
        parseFloat(this.images.children[0].style.left) - this.newWidth;

      for (let i = 0; i < this.images.children.length; i++) {
        this.lastPositions.push(parseFloat(this.images.children[i].style.left));
      }

      this.touchArea.addEventListener("touchstart", this.handleTouchStart, {
        passive: false,
      });
      this.touchArea.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
      });
      this.touchArea.addEventListener("touchend", this.handleTouchEnd, {
        passive: false,
      });

      /* ****************************************************************** */

      /* ***************************** Button navigation ******************* */

      this.scrollInProgress = false;

      /* ****************************************************************** */

      /* ***************************** Wheel navigation ******************* */

      this.mouseOver = false;
      this.wheelTimeoutId = null;

      this.touchArea.addEventListener("mouseover", this.handleMouseOver, {
        passive: false,
      });
      this.touchArea.addEventListener("mouseleave", this.handleMouseLeave, {
        passive: false,
      });
      this.touchArea.addEventListener("wheel", this.handleWheel, {
        passive: false,
      });

      /* ****************************************************************** */

      /* ***************************** Snap Back Logic ******************* */

      this.snapInProgress = false;
      this.distanceToScroll = 0.0;
      this.seed = 0.0;
      this.snapSpeedModifier = 0.05;

      /* ****************************************************************** */

      
    });
  }

  orderCards = () => {
    //const cardWidth = parseFloat(styles.viewPort.width);
    const middleCardByIndex = Math.floor(this.state.numberOfCardsByIndex / 2);

    let counterForRight = 1;
    let counterForLeft = middleCardByIndex;
    //console.log(middleCardByIndex);
    //console.log(this);
    for (let i = 0; i < this.images.children.length; i++) {
      this.images.children[i].style.transitionDuration = "0.0s";

      if (i < middleCardByIndex) {
        this.images.children[i].style.left = `${
          -1 * (counterForLeft * this.newWidth - this.newWidth / 2)
        }px`;
        counterForLeft--;
      } else if (i > middleCardByIndex) {
        this.images.children[i].style.left = `${
          counterForRight * this.newWidth + this.newWidth / 2
        }px`;
        counterForRight++;
      } else {
        this.images.children[i].style.left = `${this.newWidth / 2}px`;
      }
    }
  };

  handleBoundaries = () => {
    if (this.lastPositions[this.state.numberOfCardsByIndex] >= this.rightBoundary) {
      const beginningOfDeck = this.lastPositions[0] - this.newWidth;
      this.images.children[this.state.numberOfCardsByIndex].style.left = `${beginningOfDeck}px`;
      this.lastPositions[this.state.numberOfCardsByIndex] = beginningOfDeck;      
      this.images.insertBefore(this.images.children[this.state.numberOfCardsByIndex], this.images.children[0]);
      this.lastPositions.splice(0, 0, this.lastPositions.pop());
    }
    if (this.lastPositions[0] <= this.leftBoundary) {
      const endOfDeck =
        this.lastPositions[this.state.numberOfCardsByIndex] + this.newWidth;
      this.images.children[0].style.left = `${endOfDeck}px`;
      this.lastPositions[0] = endOfDeck;

      this.images.appendChild(
        this.images.children[0],
        this.images.children[this.state.numberOfCardsByIndex]
      );
      this.lastPositions.splice(
        this.state.numberOfCardsByIndex,
        0,
        this.lastPositions.shift()
      );
    }
  };

  /* ***************************** Snap Back Logic ******************* */

  snapBack = () => {
    this.snapInProgress = true;

    const adjustedPositions = this.lastPositions.map(position => Math.abs(position - (this.newWidth / 2)));
    const closestCardByIndex = adjustedPositions.indexOf(Math.min(...adjustedPositions));

    this.distanceToScroll = adjustedPositions[closestCardByIndex] * 
      (this.lastPositions[closestCardByIndex] > (this.newWidth / 2) ? -1.0 : 1.0);

    this.animateSnap();
  };

  animateSnap = () => {
    this.seed = parseFloat(this.seed.toFixed(2));

    let percentageToMove = Math.pow(this.seed, 2.0);
    percentageToMove = parseFloat(percentageToMove.toFixed(2));

    if (this.seed > 1) {
      this.snapInProgress = false;
      this.seed = 0.0;

      for (let i = 0; i < this.images.children.length; i++) {
        this.updatedPosition = this.lastPositions[i] + this.distanceToScroll;
        this.images.children[i].style.left = `${this.updatedPosition}px`; 
        this.lastPositions[i] = this.updatedPosition;     
      }

      this.handleBoundaries();
      return;
    }

    for (let i = 0; i < this.images.children.length; i++) {
      this.updatedPosition = this.lastPositions[i] + (percentageToMove * this.distanceToScroll);
      this.images.children[i].style.left = `${this.updatedPosition}px`;      
    }

    this.seed += 1 * this.snapSpeedModifier;
    requestAnimationFrame(this.animateSnap);
  }

  /* ****************************************************************** */

  /* ***************************** Touch navigation ******************* */

  handleTouchStart = (event) => {
    if (this.snapInProgress) return;

    this.startTouchPostition = event.changedTouches[0].screenX;

    for (let i = 0; i < this.images.children.length; i++) {
      this.images.children[i].style.transitionDuration = "0.0s";
    }
  };

  handleTouchMove = (event) => {
    event.preventDefault();
    if (this.snapInProgress) return;

    const currentTouchPosition = event.changedTouches[0].screenX;
    let difference = currentTouchPosition - this.startTouchPostition;
    difference *= this.speedModifier;

    this.startTouchPostition = currentTouchPosition;

    for (let i = 0; i < this.images.children.length; i++) {
      this.updatedPosition = this.lastPositions[i] + difference;
      this.images.children[i].style.left = `${this.updatedPosition}px`;
      this.lastPositions[i] = this.updatedPosition;
    }

    this.handleBoundaries();
  };

  handleTouchEnd = () => {
    if (this.snapInProgress) return;

    this.snapBack();
  };

  /* ****************************************************************** */

  /* ***************************** Button navigation ******************* */

  handleNext = () => {
    if (this.scrollInProgress || this.snapInProgress) return;
    this.scrollInProgress = true;

    for (let i = 0; i < this.images.children.length; i++) {
      this.updatedPosition = this.lastPositions[i] - this.newWidth;
      this.images.children[i].style.transitionDuration = "0.7s";
      this.images.children[i].style.left = `${this.updatedPosition}px`;
      this.lastPositions[i] = this.updatedPosition;
    }

    this.handleBoundaries();

    setTimeout(() => {
      this.scrollInProgress = false;
    }, 500);
  };

  handlePrev = () => {
    if (this.scrollInProgress || this.snapInProgress) return;
    this.scrollInProgress = true;

    for (let i = 0; i < this.images.children.length; i++) {
      this.updatedPosition = this.lastPositions[i] + this.newWidth;      
      this.images.children[i].style.transitionDuration = "0.5s";      
      this.images.children[i].style.left = `${this.updatedPosition}px`;      
      this.lastPositions[i] = this.updatedPosition;
    }

    this.handleBoundaries();

    setTimeout(() => {
      this.scrollInProgress = false;
    }, 500);
  };

  /* ****************************************************************** */

  /* ***************************** Wheel navigation ******************* */

  handleMouseOver = () => {
    if (this.snapInProgress) return;
    this.mouseOver = true;

    for (let i = 0; i < this.images.children.length; i++) {
      this.images.children[i].style.transitionDuration = "0.0s";
    }
  };

  handleMouseLeave = () => {
    if (this.snapInProgress) return;
    this.mouseOver = false;
  };

  handleWheel = (event) => {
    event.preventDefault();
    clearTimeout(this.wheelTimeoutId);
    if (this.snapInProgress) return;

    if (this.mouseOver) {
      for (let i = 0; i < this.images.children.length; i++) {
        this.updatedPosition = this.lastPositions[i] + event.deltaY * 0.75;
        this.images.children[i].style.left = `${this.updatedPosition}px`;
        this.lastPositions[i] = this.updatedPosition;
      }

      this.handleBoundaries();

      this.wheelTimeoutId = setTimeout(() => {
        this.snapBack();
      }, 100);
    }
  };

  /* ****************************************************************** */

  render() {
    return (
      <Fragment>
        <button onClick={this.handlePrev} id="prev">
          Prev
        </button>
        <button onClick={this.handleNext} id="next">
          Next
        </button>
        <div style={styles.navButtonsContainer} ref={refId => this.navButtonsContainer = refId}  className="navButtonsContainer">
          <img style={styles.navButtons} ref={refId => this.navButtonPrev = refId} src="./prev.png" alt="prev" className="navButtons" id="prev" onClick={this.handlePrev} />
          <img style={styles.navButtons} ref={refId => this.navButtonNext = refId}  src="./next.png" alt="next" className="navButtons" id="next" onClick={this.handleNext} />
        </div>
        <div
          ref={(refId) => (this.touchArea = refId)}
          style={styles.touchArea}
          className="touchArea"
        ></div>
        <div
          ref={(refId) => (this.viewPort = refId)}
          style={styles.viewPort}
          className="viewPort"
        >
          <div
            ref={(refId) => (this.images = refId)}
            style={styles.imagesContainer}
            className="imagesContainer"
          >
            {this.state.cards}
          </div>
        </div>
      </Fragment>
    );
  }
}

const styles = {
  viewPort: {
    margin: 0,
    padding: 0,
    width: "500px",
    height: "300px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    //overflow: "hidden"
  },
  imagesContainer: {
    margin: 0,
    padding: 0,
    width: "inherit",
    height: "inherit",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  touchArea: {
    margin: 0,
    padding: 0,
    width: "100vw",
    height: "300px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    //backgroundColor: "rgba(255, 0, 0, 0.2)",
    zIndex: 9999,
  },
  navButtonsContainer: {
    margin: 0,
    padding: 0,
    width: "100vw",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    //backgroundColor: "rgba(0, 0, 255, 0.3)",
    zIndex: 99999,
    pointerEvents: "none"
  },
  navButtons: {
    width: "50%",
    height: "auto",
    cursor: "pointer",
    pointerEvents: "all"
  }
};

export default Deck;
