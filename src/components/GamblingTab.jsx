import React, { useState, useEffect } from "react";
import styled from "styled-components";
import GlitchTitle from "./GlitchTitle";
import InvestmentAnalysis from "./InvestmentAnalysis";

const extractPrices = (cryptos) => {
  return cryptos.reduce((acc, coin) => {
    acc[coin.name.toLowerCase()] = coin.current_price;
    return acc;
  }, {});
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: white;
  position: relative;
  padding: 20px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  flex-wrap: wrap; /* Ensures responsiveness */

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center; /* Center align on small screens */
  }
`;

const Card = styled.div`
  flex: 1;
  max-width: 500px;
  padding: 2rem;
  background: white;
  color: #333;
  border-radius: 16px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  min-width: 350px;
`;

const RefreshIndicator = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 0.9rem;
  color: #666;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  font-family: "Poppins", sans-serif;
`;

const BalanceText = styled.p`
  margin-top: 0.75rem;
  text-align: center;
  font-size: 1.25rem;
  span {
    font-weight: bold;
    color: #fe7682;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 1.1rem;
  font-weight: 500;
  color: #444;
  margin-top: 1.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border-radius: 8px;
  background: #ffdce0;
  border: 1px solid #ff99aa;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border-radius: 8px;
  background: #ffdce0;
  border: 1px solid #ff99aa;
`;

const Button = styled.button`
  margin-top: 2rem;
  width: 100%;
  background: #ffa0a9;
  color: white;
  font-weight: bold;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    background: #fe7682;
  }
`;

const InvestmentList = styled.ul`
  margin-top: 1.5rem;
  list-style: none;
  padding: 0;
`;

const InvestmentItem = styled.li`
  padding: 16px;
  background: #ffdce0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ff99aa;
  margin-top: 10px;
  flex-direction: column;
`;

export default function GamblingTab() {
  const [balance, setBalance] = useState(1000);
  const [investments, setInvestments] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [amount, setAmount] = useState("");
  const [cryptos, setCryptos] = useState([]);
  const [lastRefresh, setLastRefresh] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch live crypto data from backend
  useEffect(() => {
    fetch("http://localhost:5001/api/cryptos")
      .then(response => response.json())
      .then(data => {
        setCryptos(data);
        if (data.length > 0) setSelectedAsset(data[0].id);
        setLoading(false);
        setLastRefresh(new Date().toLocaleTimeString()); // Set initial timestamp
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Update investment prices and refresh timestamp every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5001/api/cryptos")
        .then(response => response.json())
        .then(data => {
          setInvestments(prevInvestments =>
            prevInvestments.map(inv => {
              const updatedCrypto = data.find(coin => coin.name === inv.asset);
              if (!updatedCrypto) return inv;

              const newROI = ((updatedCrypto.current_price - inv.priceAtInvestment) / inv.priceAtInvestment) * 100;

              return {
                ...inv,
                currentPrice: updatedCrypto.current_price,
                roi: newROI.toFixed(2),
              };
            })
          );

          setLastRefresh(new Date().toLocaleTimeString()); // Update timestamp on refresh
        })
        .catch(error => console.error("Error updating prices:", error));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleInvest = () => {
    if (amount > 0 && amount <= balance) {
      const selectedCrypto = cryptos.find(coin => coin.id === selectedAsset);
      if (!selectedCrypto) return;

      const unitsBought = amount / selectedCrypto.current_price;

      const newInvestment = {
        asset: selectedCrypto.name,
        amount: amount,
        units: unitsBought,
        priceAtInvestment: selectedCrypto.current_price,
        currentPrice: selectedCrypto.current_price,
        roi: "0.00",
      };

      setInvestments([...investments, newInvestment]);
      setBalance(balance - amount);
      setAmount(0);
    }
  };

  const handleSell = (index) => {
    const updatedInvestments = [...investments];
    const soldInvestment = updatedInvestments.splice(index, 1)[0];

    const profit = soldInvestment.units * soldInvestment.currentPrice;
    setBalance(balance + profit);
    setInvestments(updatedInvestments);
  };

  const prices = extractPrices(cryptos);

  return (
    <Container>
      <RefreshIndicator>Last Updated: {lastRefresh}</RefreshIndicator> {/* Shows last refresh time */}
      <ContentWrapper>
      <Card>
        <div className="flex flex-col items-center justify-center p-8">
          <GlitchTitle />
        </div>
        <BalanceText>
          Balance: <span>${balance.toFixed(2)}</span>
        </BalanceText>
        <Label>Select Asset:</Label>
        <Select value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)}>
          {cryptos.map((coin) => (
            <option key={coin.id} value={coin.id}>
              {coin.name} (${coin.current_price.toFixed(2)})
            </option>
          ))}
        </Select>

        <Label>Investment Amount:</Label>
        <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/^0+/, ""))}
            placeholder="Enter amount"
          />
        <Button onClick={handleInvest}>Invest</Button>

        <h3 style={{ marginTop: "2rem", fontSize: "1.5rem", fontWeight: "bold", color: "#444" }}>Your Investments</h3>
        <InvestmentList>
          {investments.map((inv, index) => (
            <InvestmentItem key={index}>
              <span>
                {inv.asset}: <strong>${inv.amount}</strong> | Bought at: ${inv.priceAtInvestment.toFixed(2)}
              </span>
              <span>
                Current Price: <strong>${inv.currentPrice.toFixed(2)}</strong>
              </span>
              <span>
                Units Owned: <strong>{inv.units.toFixed(4)}</strong>
              </span>
              <span>
                ROI:{" "}
                <span style={{ color: inv.roi >= 0 ? "green" : "red" }}>
                  {inv.roi}%
                </span>
              </span>
              <Button onClick={() => handleSell(index)} style={{ width: "auto", padding: "8px 12px", fontSize: "0.9rem" }}>
                Sell
              </Button>
            </InvestmentItem>
          ))}
        </InvestmentList>
        </Card>
        <InvestmentAnalysis balance={balance} investments={investments} prices={prices} />
      </ContentWrapper>
    </Container>
  );
}
