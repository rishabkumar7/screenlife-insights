'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Footer from '@/components/Footer'; 

const LifeGrid = ({ totalWeeks, livedWeeks, remainingScreenWeeks, remainingSleepWeeks }) => {
  const weeksPerRow = 52; // 52 weeks per year
  const totalRows = Math.ceil(totalWeeks / weeksPerRow);

  return (
    <div className="space-y-0.5 overflow-x-auto">
      {[...Array(totalRows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-0.5 min-w-max">
          {[...Array(weeksPerRow)].map((_, colIndex) => {
            const weekIndex = rowIndex * weeksPerRow + colIndex;
            let color = 'bg-gray-300'; // Default remaining life
            if (weekIndex < livedWeeks) {
              color = 'bg-red-500'; // Lived life
            } else {
              const remainingIndex = weekIndex - livedWeeks;
              if (remainingIndex < remainingScreenWeeks) {
                color = 'bg-blue-500'; // Future screen time
              } else if (remainingIndex < remainingScreenWeeks + remainingSleepWeeks) {
                color = 'bg-purple-500'; // Future sleep time
              } else {
                color = 'bg-gray-300'; // Future waking time
              }
            }
            return (
              <div
                key={colIndex}
                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 ${color}`}
                title={`Week ${weekIndex + 1}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const RemainingLifeGrid = ({ remainingWeeks, screenWeeks, sleepWeeks }) => {
  const weeksPerRow = 52; // 52 weeks per year
  const totalRows = Math.ceil(remainingWeeks / weeksPerRow);

  return (
    <div className="space-y-0.5 overflow-x-auto">
      {[...Array(totalRows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-0.5 min-w-max">
          {[...Array(weeksPerRow)].map((_, colIndex) => {
            const weekIndex = rowIndex * weeksPerRow + colIndex;
            let color = 'bg-green-500'; // Default waking time
            if (weekIndex < screenWeeks) {
              color = 'bg-blue-500'; // Screen time
            } else if (weekIndex < screenWeeks + sleepWeeks) {
              color = 'bg-purple-500'; // Sleep time
            }
            return (
              <div
                key={colIndex}
                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 ${color}`}
                title={`Week ${weekIndex + 1}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const LifeRemainingCalculator = () => {
  const [age, setAge] = useState('');
  const [screenTime, setScreenTime] = useState('');
  const [sleepTime, setSleepTime] = useState(''); // Default 8 hours of sleep
  const [results, setResults] = useState(null);

  const calculateRemainingLife = () => {
    const baseLifeExpectancy = 80; // Example base life expectancy
    const yearsLived = parseInt(age);
    const dailyScreenHours = parseFloat(screenTime);
    const dailySleepHours = parseFloat(sleepTime);

    const totalYears = baseLifeExpectancy;
    const remainingYears = Math.max(0, totalYears - yearsLived);

    const totalWeeks = totalYears * 52;
    const livedWeeks = yearsLived * 52;
    const remainingWeeks = totalWeeks - livedWeeks;
    
    const screenTimeWeeksSoFar = Math.floor((yearsLived * dailyScreenHours * 365) / (16 * 7));
    const sleepWeeksSoFar = Math.floor((yearsLived * dailySleepHours * 365) / (24 * 7));

    const wakingHoursPerDay = 24 - dailySleepHours;
    const wakingYearsRemaining = remainingYears * (wakingHoursPerDay / 24);
    const screenTimeYearsRemaining = (dailyScreenHours / wakingHoursPerDay) * remainingYears;
    const sleepYearsRemaining = (dailySleepHours / 24) * remainingYears;

    const remainingScreenWeeks = Math.floor(screenTimeYearsRemaining * 52);
    const remainingSleepWeeks = Math.floor(sleepYearsRemaining * 52);

    // Calculate percentage of waking life spent on screens
    const totalWakingHours = wakingHoursPerDay * 365 * totalYears;
    const totalScreenHours = dailyScreenHours * 365 * totalYears;
    const screenTimePercentage = (totalScreenHours / totalWakingHours) * 100;

    setResults({
      totalWeeks,
      livedWeeks,
      remainingWeeks,
      remainingScreenWeeks,
      remainingSleepWeeks,
      yearsLived,
      remainingYears,
      wakingYearsRemaining: wakingYearsRemaining.toFixed(1),
      screenTimeYearsSoFar: (screenTimeWeeksSoFar / 52).toFixed(1),
      sleepYearsSoFar: (sleepWeeksSoFar / 52).toFixed(1),
      screenTimeYearsRemaining: screenTimeYearsRemaining.toFixed(1),
      sleepYearsRemaining: sleepYearsRemaining.toFixed(1),
      screenTimePercentage: screenTimePercentage.toFixed(1),
    });
  };

  return (
    <div className="min-h-screen px-2 py-4 sm:px-8 lg:px-12">
    <div className="container mx-auto max-w-[98%] sm:max-w-4xl flex-grow">
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">ScreenLife Insights</CardTitle>
        </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Daily screen time (hours)"
                value={screenTime}
                onChange={(e) => setScreenTime(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Daily sleep time (hours)"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
              />
              <Button onClick={calculateRemainingLife} className="w-full sm:w-auto">Calculate</Button>

              {results && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Results:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold">Life Lived</h4>
                      <p>Years lived: {results.yearsLived}</p>
                      <p>Time spent on screens so far: {results.screenTimeYearsSoFar} years</p>
                      <p>Time spent sleeping so far: {results.sleepYearsSoFar} years</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Life Remaining</h4>
                      <p>Years Remaining: {results.remainingYears}</p>
                      <p>Waking Years left: {results.wakingYearsRemaining}</p>
                      <p className="font-semibold">Time that will be spent on phone screen: {results.screenTimeYearsRemaining} years</p>
                      <p>Time that will be spent sleeping: {results.sleepYearsRemaining} years</p>
                    </div>
                  </div>
                  <div className="mt-6 p-3 bg-blue-100 rounded-md">
                    <p className="font-semibold text-blue-800">
                      You will be spending {results.screenTimePercentage}% of waking life on phone screen, that is {results.screenTimeYearsRemaining} years.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="font-semibold mb-2">Life Visualization</h4>
                      <LifeGrid 
                        totalWeeks={results.totalWeeks}
                        livedWeeks={results.livedWeeks}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Remaining Life Visualization</h4>
                      <RemainingLifeGrid 
                        remainingWeeks={results.remainingWeeks}
                        screenWeeks={results.remainingScreenWeeks}
                        sleepWeeks={results.remainingSleepWeeks}
                      />
                    </div>
                  </div>
                  <div className="mt-6 text-xs sm:text-sm grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div><span className="inline-block w-3 h-3 bg-red-500 mr-2"></span>Life lived</div>
                    <div><span className="inline-block w-3 h-3 bg-gray-300 mr-2"></span>Life remaining</div>
                    <div><span className="inline-block w-3 h-3 bg-blue-500 mr-2"></span>Future screen time</div>
                    <div><span className="inline-block w-3 h-3 bg-purple-500 mr-2"></span>Future sleep time</div>
                    <div><span className="inline-block w-3 h-3 bg-green-500 mr-2"></span>Future waking time</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default LifeRemainingCalculator;