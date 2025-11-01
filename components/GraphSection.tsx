import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { TableItem } from "../types";
import { getThemeColors } from "../constants/colors";
import { graphSectionStyles } from "../styles/GraphSection.styles";

const screenWidth = Dimensions.get("window").width;

interface GraphSectionProps {
  tableData: TableItem[];
  isSecondDegree: boolean;
}

export default function GraphSection({
  tableData,
  isSecondDegree,
}: GraphSectionProps) {
  const colors = getThemeColors(isSecondDegree);

  const filteredTableData = isSecondDegree
    ? tableData.filter((_, index) => index % 2 === 0)
    : tableData;

  return (
    <View
      style={[
        graphSectionStyles.sectionContainer,
        { backgroundColor: colors.CLR_SURFACE, borderColor: colors.CLR_BORDER },
      ]}
    >
      <Text
        style={[
          graphSectionStyles.sectionTitle,
          { color: colors.CLR_ON_SURFACE, borderBottomColor: colors.CLR_BORDER },
        ]}
      >
        Tabla de Valores
      </Text>
      <View style={[graphSectionStyles.tableList, { borderColor: colors.CLR_BORDER }]}>
        {filteredTableData.map((item, index) => (
          <View
            key={item.x.toString()}
            style={[
              graphSectionStyles.tableRow,
              index % 2 === 0
                ? [
                    graphSectionStyles.tableRowEven,
                    {
                      backgroundColor: isSecondDegree ? "#2A2A2A" : "#F5F5F5",
                    },
                  ]
                : [graphSectionStyles.tableRowOdd, { backgroundColor: colors.CLR_SURFACE }],
            ]}
          >
            <Text style={[graphSectionStyles.tableText, { color: colors.CLR_ON_SURFACE }]}>
              x = {item.x}
            </Text>
            <Text style={[graphSectionStyles.tableText, { color: colors.CLR_ON_SURFACE }]}>
              y = {item.y}
            </Text>
          </View>
        ))}
      </View>

      <Text
        style={[
          graphSectionStyles.sectionTitle,
          { color: colors.CLR_ON_SURFACE, borderBottomColor: colors.CLR_BORDER },
        ]}
      >
        Gráfica en Plano Cartesiano
      </Text>
      <View style={{ alignItems: "center" }}>
        <LineChart
          data={{
            labels: tableData.map((d) => d.x.toString()),
            datasets: [
              { data: tableData.map((d) => parseFloat(d.y)) },
              {
                data: Array(tableData.length).fill(0),
                color: () => (isSecondDegree ? "#FFFFFF" : "#000"),
              },
            ],
          }}
          width={screenWidth - 40}
          height={260}
          yAxisSuffix=""
          yAxisInterval={isSecondDegree ? 20 : 1}
          chartConfig={{
            backgroundGradientFrom: colors.CLR_SURFACE,
            backgroundGradientTo: colors.CLR_SURFACE,
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(132, 255, 230, ${opacity})`,
            labelColor: (opacity = 1) =>
              `rgba(${isSecondDegree ? "255, 255, 255" : "0, 0, 0"}, ${opacity})`,
            propsForDots: {
              r: "3",
              strokeWidth: "2",
              stroke: colors.CLR_ACCENT,
            },
          }}
          bezier={false}
          fromZero={false}
          withInnerLines={true}
          withOuterLines={false}
          style={graphSectionStyles.chart}
        />

        <View
          style={{
            position: "absolute",
            top: 130,
            width: screenWidth - 40,
            height: 2,
            backgroundColor: isSecondDegree ? "#FFF" : "#000",
          }}
        />
        <View
          style={{
            position: "absolute",
            left: (screenWidth - 40) / 2,
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: isSecondDegree ? "#FFF" : "#000",
          }}
        />
        <View
          style={[
            graphSectionStyles.symbolizationBox,
            {
              backgroundColor: isSecondDegree ? "#2A2A2A" : "#FFF3E0",
              borderColor: isSecondDegree ? "#4F4F4F" : "#FFB74D",
            },
          ]}
        >
          <Text
            style={[
              graphSectionStyles.sectionTitle,
              { color: colors.CLR_ON_SURFACE, borderBottomColor: colors.CLR_BORDER },
            ]}
          >
            Simbolización de la Gráfica
          </Text>
          <Text style={[graphSectionStyles.symbolText, { color: colors.CLR_ON_SURFACE }]}>
            • Eje X (horizontal): representa los valores de x.
          </Text>
          {isSecondDegree ? (
            <>
              <Text style={[graphSectionStyles.symbolText, { color: colors.CLR_ON_SURFACE }]}>
                • Eje Y (vertical): representa los valores de y = f(x) = ax² + bx +
                c.
              </Text>
              <Text style={[graphSectionStyles.symbolText, { color: colors.CLR_ON_SURFACE }]}>
                • Línea turquesa: la parábola de la ecuación cuadrática.
              </Text>
              <Text style={[graphSectionStyles.symbolText, { color: colors.CLR_ON_SURFACE }]}>
                • Cruce con el eje X: soluciones de la ecuación (x donde y = 0).
              </Text>
              <Text style={[graphSectionStyles.symbolText, { color: colors.CLR_ON_SURFACE }]}>
                • Puntos: valores calculados para ver la forma de la parábola.
              </Text>
            </>
          ) : (
            <>
              <Text style={[graphSectionStyles.symbolText, { color: colors.CLR_ON_SURFACE }]}>
                • Eje Y (vertical): representa los valores de y = f(x) = ax + b.
              </Text>
              <Text style={[graphSectionStyles.symbolText, { color: colors.CLR_ON_SURFACE }]}>
                • Línea azul: la recta de la ecuación lineal.
              </Text>
              <Text style={[graphSectionStyles.symbolText, { color: colors.CLR_ON_SURFACE }]}>
                • Cruce con el eje X: solución de la ecuación (x donde y = 0).
              </Text>
              <Text style={[graphSectionStyles.symbolText, { color: colors.CLR_ON_SURFACE }]}>
                • Puntos: valores calculados para ver la pendiente de la recta.
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}


