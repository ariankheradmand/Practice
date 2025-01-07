import React from "react";

const Random = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className=" flex flex-col mt-36 random-component">
      <div className="py-20 px-6 bg-gray-600 text-white">
        <p>hello my old friend</p>
      </div>
      <div className="py-20 px-6 bg-red-300">
        <p>hello my old friend</p>
      </div>
    </div>
  );
});

export default Random;
