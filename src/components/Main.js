import React, { useState, useEffect } from "react";

function Main() {
  const [priceList, setPriceList] = useState([]);
  const [amountList, setAmountList] = useState([]);
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [average, setAverage] = useState(0);
  const [accumulated, setAccumulated] = useState(0);
  const [cutlossPercentage, setCutlossPercentage] = useState(0);
  const [cutloss, setCutloss] = useState(0);
  const [target, setTarget] = useState(0);
  const [cutlossAmount, setCutlossAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [status, setStatus] = useState(0);

  useEffect(() => {
    let totalamount = 0;
    let accum = 0;
    for (let i = 0; i < priceList.length; i++) {
      accum += priceList[i].price * amountList[i].amount;
      totalamount += amountList[i].amount;
    }
    setAccumulated(accum);
    if (totalamount !== 0) {
      setAverage((accum / totalamount).toFixed(8));
      setCutloss(
        (accum / totalamount) *
          (1 - Number(cutlossPercentage) * 0.01).toFixed(8)
      );
    }

    setCutlossAmount(
      (accum * Number(cutlossPercentage) * 0.01 + accum * 2 * 0.0015).toFixed(2)
    );
    setTax(accum * 2 * 0.0015);
  }, [priceList, cutlossPercentage]);

  const addHandler = () => {
    if (isNaN(Number(price)) || isNaN(Number(amount))) {
      return;
    }
    setPriceList(priceList.concat({ price: Number(price) }));
    setAmountList(amountList.concat({ amount: Number(amount) }));
    setPrice("");
    setAmount("");
  };

  const deleteHandler = (index) => {
    setPriceList(
      priceList.filter((v, i) => {
        return i != index;
      })
    );
    setAmountList(
      amountList.filter((v, i) => {
        return i != index;
      })
    );
  };

  const handlePercentage = (e) => {
    setCutlossPercentage(Number(e.target.value));
  };

  return (
    <div>
      <ul>
        {priceList.map((price, index) => {
          return (
            <>
              <li>
                {price.price} {amountList[index].amount}
                <button
                  onClick={() => {
                    deleteHandler(index);
                  }}
                >
                  Del
                </button>
              </li>
            </>
          );
        })}
      </ul>
      <input
        type="text"
        onChange={(e) => {
          setPrice(e.target.value);
        }}
        value={price}
        placeholder="가격"
      />
      <input
        type="text"
        onChange={(e) => {
          setAmount(e.target.value);
        }}
        value={amount}
        placeholder="수량"
      />
      <button onClick={() => addHandler()}>Add</button>
      <h3>총 매입금액 : {accumulated}</h3>
      <h3>평균 매입단가 : {average}</h3>
      <h3>
        손절비중(%) :{" "}
        <input
          type="text"
          onChange={(e) => {
            handlePercentage(e);
          }}
        />
      </h3>
      <h3>
        {cutlossPercentage}% 손절 단가 : {cutloss}
      </h3>
      <h3>수수료 : {tax}</h3>
      <h3>손실 총액 : {cutlossAmount}</h3>
    </div>
  );
}

export default Main;
