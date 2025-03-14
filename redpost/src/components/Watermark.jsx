import React from 'react'

const Watermark = () => {
  return (
    <div id="background">
      {Array.from({ length: 15}).map((_, index) => (
        <div key={index} className="d-flex flex-column gap-5">
          {Array.from({ length: 20 }).map((_, index) => (
            <p key={index} id="bg-text">Under Development</p>
          ))}
        </div>
      ))}
	</div>
  )
}

export default Watermark