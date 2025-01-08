import React from "react";

const Random = React.forwardRef((props, ref) => {
  return (
    <div ref={ref}className=" flex flex-col mt-36 random-component ">
      <div className="py-20 px-6 bg-purple-400 text-white">
        <p>سلام دوست من خوش اومدی</p>
      </div>
      <div className="py-20 px-6 bg-red-300">
      <p>سلام دوست من خوش اومدی</p>
      </div>
    </div>
  );
});

export default Random;
