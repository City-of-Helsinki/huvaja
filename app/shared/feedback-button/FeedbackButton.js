import React from 'react';

function FeedbackButton() {
  return (
    <div className="feedback-floating">
      <a href="mailto:palaute.huonevaraus@hel.fi?subject=Huonevaraus-palaute" className="feedback-trigger--float">
        <div className="btn btn-primary">
          Anna palautetta
        </div>
      </a>
    </div>
  );
}

export default FeedbackButton;
