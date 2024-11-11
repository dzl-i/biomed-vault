"use client"

import { Card, CardBody, CardHeader, Divider, Spinner } from "@nextui-org/react"
import { DashboardData } from "@/utils/types";
import { useEffect, useState } from "react";
import { HeartPulseIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts";
import ReactWordcloud from "react-wordcloud";
import Link from "next/link";

export const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoadingDashboard(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/visualisation/data`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setData(data.dashboardData);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch dashboard data:", errorData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center w-full h-64">
        <p className="text-lg">No dashboard data found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-5/6 my-12">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-4">
          <HeartPulseIcon size={42} />
          <p className="text-5xl">Welcome, <span className="font-extrabold">{sessionStorage.getItem("name")}</span></p>
        </div>
      </div>

      <Divider className="my-8" />
      {isLoadingDashboard ? <Spinner label="Fetching dashboard data..." color="primary" /> :
        <div className="grid grid-cols-2 gap-8 mb-12">
          {/* Patient Demographics */}
          <Card>
            <Link href={"/patients"}>
              <CardHeader className="flex items-center justify-center">
                <h2 className="text-2xl font-bold">Patient Demographics</h2>
              </CardHeader>
              <CardBody className="flex items-center justify-center">
                <BarChart width={600} height={300} data={data.patientDemographics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="male" fill="#8884d8" name="Male" />
                  <Bar dataKey="female" fill="#82ca9d" name="Female" />
                  <Bar dataKey="other" fill="#ffc658" name="Other" />
                </BarChart>
              </CardBody>
            </Link>
          </Card>

          {/* Phenotype Traits Word Cloud */}
          <Card>
            <Link href={"/phenotypes"}>
              <CardHeader className="flex items-center justify-center">
                <h2 className="text-2xl font-bold">Phenotype Traits</h2>
              </CardHeader>
              <CardBody className="flex items-center justify-center">
                <div className="flex items-center justify-center">
                  <ReactWordcloud
                    words={data.phenotypeTraitsCloud}
                    options={{ rotations: 0 }}
                  />
                </div>
              </CardBody>
            </Link>
          </Card>

          {/* Genomic Data Distribution */}
          <Card>
            <Link href={"/genomics"}>
              <CardHeader className="flex items-center justify-center">
                <h2 className="text-2xl font-bold">Genomic Data Distribution</h2>
              </CardHeader>
              <CardBody className="flex items-center justify-center">
                <PieChart width={450} height={300}>
                  <Pie
                    data={data.genomicDistribution}
                    cx={150}
                    cy={150}
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {data.genomicDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </CardBody>
            </Link>
          </Card>

          {/* Mutation Types Word Cloud */}
          <Card>
            <Link href={"/genomics"}>
              <CardHeader className="flex items-center justify-center">
                <h2 className="text-2xl font-bold">Mutation Types</h2>
              </CardHeader>
              <CardBody className="flex items-center justify-center">
                <div className="flex items-center justify-center">
                  <ReactWordcloud
                    words={data.mutationTypesCloud}
                    options={{ rotations: 0 }}
                  />
                </div>
              </CardBody>
            </Link>
          </Card>

          {/* Imaging Data Distribution */}
          <Card>
            <Link href={"/imaging"}>
              <CardHeader className="flex items-center justify-center">
                <h2 className="text-2xl font-bold">Imaging Data Distribution</h2>
              </CardHeader>
              <CardBody className="flex items-center justify-center">
                <PieChart width={450} height={300}>
                  <Pie
                    data={data.imagingDistribution}
                    cx={150}
                    cy={150}
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {data.imagingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </CardBody>
            </Link>
          </Card>

          {/* Signal Data Distribution */}
          <Card>
            <Link href={"/signals"}>
              <CardHeader className="flex items-center justify-center">
                <h2 className="text-2xl font-bold">Signal Data Distribution</h2>
              </CardHeader>
              <CardBody className="flex items-center justify-center">
                <PieChart width={450} height={300}>
                  <Pie
                    data={data.signalDistribution}
                    cx={150}
                    cy={150}
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {data.signalDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </CardBody>
            </Link>
          </Card>
        </div>
      }
    </div>
  )
}