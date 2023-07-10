async function convertCurrency() {
  try {
    const amount = document.getElementById("amount").value;
    
    if (amount < 0) {
      throw new Error("Ingrese un monto válido.");
    }

    const currency = document.getElementById("currency").value;
    let apiEndpoint = "";

    switch (currency) {
      case "USD":
        apiEndpoint = "dolar";
        break;
      case "EUR":
        apiEndpoint = "euro";
        break;
      case "UF":
        apiEndpoint = "uf";
        break;
      // Agrega más casos según tus necesidades
      default:
        throw new Error("Moneda seleccionada no válida");
    }

    const response = await fetch(`https://mindicador.cl/api/${apiEndpoint}`);
    const data = await response.json();

    if (!data || !data.serie || !data.serie.length) {
      throw new Error("No se encontraron datos de la serie para la moneda seleccionada");
    }

    const value = data.serie[0]?.valor;
    if (typeof value === "undefined") {
      throw new Error("No se pudo obtener el valor de la moneda");
    }

    const convertedAmount = amount / value;

    renderConversion(convertedAmount, currency);
    renderChart(data.serie);
  } catch (error) {
    showError(error.message);
  }
}




function renderConversion(convertedAmount, currency) {
  const resultContainer = document.getElementById("resultContainer");
  const symbol = getCurrencySymbol(currency);

  resultContainer.innerHTML = `Resultado: ${symbol} ${convertedAmount.toFixed(2)}`;
}

function getCurrencySymbol(currency) {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "UF":
      return "UF";
    // Agrega más casos según tus necesidades
    default:
      return "";
  }
}

function renderChart(serie) {
  const chartData = serie.slice(0, 10).reverse().map((item) => {
    return {
      x: new Date(item.fecha),
      y: item.valor
    };
  });

  const chartContainer = document.getElementById("chartContainer");
  chartContainer.style.display = "block";

  const chart = new CanvasJS.Chart("chartContainer", {
    theme: "light2",
    animationEnabled: true,
    title: {
      text: "Historial del valor de la moneda"
    },
    axisX: {
      valueFormatString: "DD/MM/YYYY"
    },
    axisY: {
      title: "Valor"
    },
    data: [{
      type: "line",
      dataPoints: chartData
    }]
  });

  chart.render();
}

function showError(errorMessage) {
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `Error: ${errorMessage}`;
}
