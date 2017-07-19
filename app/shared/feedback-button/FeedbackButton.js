import React from 'react';

function FeedbackButton() {
  return (
    <div className="feedback-floating">
      <a href="" className="feedback-trigger--float">
        <div className="btn btn-beta">Beta</div>
        <div className="btn btn-primary">
          Anna palautetta
        </div>
      </a>
    </div>
  );
}

export default FeedbackButton;
