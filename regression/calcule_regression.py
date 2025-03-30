from flask import Flask, request, jsonify
import numpy as np
from scipy.optimize import curve_fit

app = Flask(__name__)

# Régression carrée (polynomiale de degré 2)
def quadratic_regression(x, y):
    p = np.polyfit(x, y, 2)
    model = np.poly1d(p)
    return {"equation": f"y = {p[0]:.2f}x² + {p[1]:.2f}x + {p[2]:.2f}", "predictions": model(x).tolist()}

# Régression exponentielle
def exponential_regression(x, y):
    def exp_func(x, a, b, c):
        return a * np.exp(b * x) + c

    popt, _ = curve_fit(exp_func, x, y)
    predictions = exp_func(x, *popt)
    return {"equation": f"y = {popt[0]:.2f} * exp({popt[1]:.2f} * x) + {popt[2]:.2f}", "predictions": predictions.tolist()}

# Régression d'un degré quelconque
def degree_regression(x, y, degree):
    p = np.polyfit(x, y, degree)
    model = np.poly1d(p)
    return {"equation": str(model), "predictions": model(x).tolist()}

# Route pour calculer la régression
@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json  # Recevoir les données de JavaScript
    x = np.array(data['x'])
    y = np.array(data['y'])
    regression_type = data['regression_type']
    degree = data.get('degree', 2)  # Degré de régression, 2 par défaut

    if regression_type == "quadratique":
        result = quadratic_regression(x, y)
    elif regression_type == "exponentielle":
        result = exponential_regression(x, y)
    elif regression_type == "degre":
        result = degree_regression(x, y, degree)
    else:
        result = {"error": "Type de régression non pris en charge"}

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
