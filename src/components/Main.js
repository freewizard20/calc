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
  const [target, setTarget] = useState("");
  const [cutlossAmount, setCutlossAmount] = useState(0);
  const [tax, setTax] = useState(0);
  const [status, setStatus] = useState(0);
  const [taxrate, setTaxrate] = useState(0.0015);
  const [revenue, setRevenue] = useState(0);
  const [calcState, setCalcState] = useState(1);

  useEffect(() => {
    if (calcState === 0) {
      let totalamount = 0;
      let accum = 0;
      for (let i = 0; i < priceList.length; i++) {
        accum += priceList[i].price * amountList[i].amount;

        totalamount += amountList[i].amount;
      }
      setAccumulated(accum);
      let cutlossprice =
        accum / totalamount -
        (accum * Number(cutlossPercentage) * 0.01 - tax) / totalamount;
      if (totalamount !== 0) {
        setAverage(accum / totalamount);
        setCutloss(cutlossprice.toFixed(2));
        setCutlossAmount(
          (accum / totalamount - cutlossprice) * totalamount +
            accum * 2 * taxrate
        );
        setRevenue(
          (target - accum / totalamount) * totalamount - accum * 2 * taxrate
        );
      } else {
        setAverage(0);
        setCutloss(0);
        setCutlossAmount(0);
        setRevenue(0);
      }
      setTax(accum * 2 * taxrate);
    } else if (calcState === 1) {
      let totalamount = 0;
      let accum = 0;
      for (let i = 0; i < priceList.length; i++) {
        let BTCamount = amountList[i].amount / priceList[i].price;
        accum += amountList[i].amount;
        totalamount += BTCamount;
      }
      setAccumulated(totalamount);
      setAverage(accum / totalamount);
      setTax(totalamount * taxrate);
      let BTCtarget = accum / target;
      setRevenue(totalamount - BTCtarget);
      let cutlossprice_d =
        accum /
        ((1 + cutlossPercentage * 0.01) * totalamount - totalamount * taxrate);
      setCutloss(cutlossprice_d);
      setCutlossAmount(
        (accum / cutlossprice_d - totalamount + totalamount * taxrate).toFixed(
          5
        )
      );
    } else if (calcState === 2) {
      let totalamount = 0;
      let accum = 0;
      for (let i = 0; i < priceList.length; i++) {
        let BTCamount = amountList[i].amount / priceList[i].price;
        accum += amountList[i].amount;
        totalamount += BTCamount;
      }
      setAccumulated(totalamount);
      setAverage(accum / totalamount);
      setTax(totalamount * taxrate);
      let BTCtarget = accum / target;
      setRevenue(BTCtarget - totalamount);
      let cutlossprice_d =
        accum /
        ((1 - cutlossPercentage * 0.01) * totalamount + totalamount * taxrate);
      setCutloss(cutlossprice_d);
      setCutlossAmount(
        (-accum / cutlossprice_d + totalamount - totalamount * taxrate).toFixed(
          5
        )
      );
    }
  }, [priceList, cutlossPercentage, target, calcState]);

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

  const resetHandler = () => {
    setTarget("");
    setPriceList([]);
    setAmountList([]);
    setCutlossPercentage(0);
  };

  const stateHandler = (e) => {
    setCalcState(e);
    resetHandler();
  };

  return (
    <div>
      <h1>시나리오 플래너</h1>
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
      <h3>
        목표가 :{" "}
        <input
          type="text"
          onChange={(e) => {
            setTarget(e.target.value);
          }}
          value={target}
        />
      </h3>
      <h3>수익 금액 : {revenue}</h3>
      <button onClick={resetHandler}>초기화</button>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => {
            stateHandler(0);
          }}
        >
          일반거래
        </button>
        <button
          onClick={() => {
            stateHandler(1);
          }}
        >
          비트멕스 롱
        </button>
        <button
          onClick={() => {
            stateHandler(2);
          }}
        >
          비트멕스 숏
        </button>
      </div>
    </div>
  );
}

export default Main;
