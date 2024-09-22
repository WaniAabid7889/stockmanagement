import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Container, Row, Tooltip } from 'react-bootstrap';
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Pie, PieChart, Rectangle, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import Main from '../layout/Main';
import stockManagementApis from '../apis/StockManagementApis';
import { ConstructionOutlined } from '@mui/icons-material';




function HomePage() {

  const [totalStock, setTotalStock] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalReturnQuantity, setTotalReturnQuantity] = useState(0);

  //get product data useEffect
  const handleGetData = async () => {
    try{
       const result =  await stockManagementApis.getProduct();
       setTotalStock(result.reduce((total, product) => total + product.total_buy_quantity - product.total_issue_quantity, 0));
       setTotalSales(result.reduce((total, product) => total + product.total_issue_quantity, 0));
    }catch(error){
      console.log(error)
    }
  }

  //get return data useEffect
  const handleGetReturn = async () => {
    try{
       const result =  await stockManagementApis.getReturnAll();
       console.log('result data=>',result)
       setTotalReturnQuantity(result.reduce((total, returnData) => total + returnData.quantity, 0));
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    handleGetData();
    handleGetReturn();
  }, []);


  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  const piedata = [
    {
      name: "Return Stocks",
      value: parseInt(totalReturnQuantity),
      percentage: "20%",
      fill: "#3333FF"
    },
    {
      name: "Sell Stocks",
      value: parseInt(totalSales),
      percentage: "30%",
      fill: "rgb(237 183 128)"
    },
    {
      name: "total Stocks",
      value: parseInt(totalStock),
      percentage: "50%",
      fill: "rgb(146 146 212)"
    }
  ];

  const renderCustomizedLabelPercentage = (data, total = 32000) => {
    let percentageCalculated = (data.value / total) * 100;
    return percentageCalculated.toFixed(2).replace(".", ",").toString() + "%";
  };

  const renderLabel = useCallback((piePiece) => {
    return piePiece.name;
  }, []);

  return (
    <Main>
      <Container fluid>
        <Row>
          <Col md={4}>
            <Card className="mb-4" style={{ cursor: "pointer", backgroundColor: 'rgb(146 146 212)', color: "white" ,height: "85%",boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)'}}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                    <Card.Title>Total Stock</Card.Title>
                    <i className="fa fa-cubes fa-2x float-end" style={{fontSize:"30px"}}></i>
                </div>
                <Card.Text>
                  <h3 className='mt-4'>{totalStock}</h3>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4" style={{ cursor: "pointer", backgroundColor: "rgb(237 183 128)", color: "white" ,height: "85%",boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)'}}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <Card.Title>Total Items Issued</Card.Title>
                  <i className="fa fa-shopping-cart fa-2x  float-end" style={{fontSize:"30px"}}></i>  
                </div>
                <Card.Text>
                  <h3 className='mt-4'>{totalSales}</h3>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4" style={{ cursor: "pointer", backgroundColor: "rgb(239 142 142)", color: "white", height: "85%",boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)'}}>
              <Card.Body>
                <div className="d-flex justify-content-between">
                <Card.Title>Returns Stock Items</Card.Title>
                  <i className="fa fa-shopping-cart fa-2x"  style={{fontSize:"30px"}}></i>
                </div>
                <Card.Text>
                  <h3 className='mt-4'>{totalReturnQuantity}</h3>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6} className="mb-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
              </BarChart>
            </ResponsiveContainer>
          </Col>
          <Col xs={12} md={6} className="mb-4">
            <Box sx={{ width: "100%", height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={piedata}
                    label={renderLabel}
                    cx="50%"
                    cy="50%"
                    outerRadius={"75%"}
                    nameKey="name"
                  >
                    <LabelList
                      dy={-3}
                      fill="white"
                      dataKey={renderCustomizedLabelPercentage}
                      position="inside"
                      angle="0"
                      stroke="none"
                      className="label-percentage"
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Col>
        </Row>
      </Container>
    </Main>
  );
}

export default HomePage;
