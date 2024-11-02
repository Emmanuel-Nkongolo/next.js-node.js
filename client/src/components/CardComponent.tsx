import React from "react";

interface Card {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

const CardComponent: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-2 mb-2 hover:bg-gray-100">
      <div className="text-sm text-gray-600">First name: {card.firstName}</div>
      <div className="text-lg font-semibold text-gray-800">
        Last name: {card.lastName}
      </div>
      <div className="text-md text-gray-700">
        Date of birth: {card.dateOfBirth}
      </div>
    </div>
  );
};

export default CardComponent;
