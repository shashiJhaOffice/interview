import { useState } from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const DENOMINATIONS = [2000, 500, 100, 50, 20, 10];
const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

const DenominationChip = styled(Chip)(({ theme, backgroundColor }) => ({
  backgroundColor: backgroundColor || "#2e7d32",
  fontWeight: 600,
  color: "#ffffff",
  padding: theme.spacing(0.5, 1),
  margin: theme.spacing(1),
}));

function CashWithdrawalCard() {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [calculationResult, setCalculationResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [validationError, setValidationError] = useState("");

  const calculateMinimumNotes = (amount) => {
    const result = [];
    let remainingAmount = amount;

    for (const denomination of DENOMINATIONS) {
      if (remainingAmount >= denomination) {
        const count = Math.floor(remainingAmount / denomination);
        result.push({
          denomination,
          count,
          total: denomination * count,
        });
        remainingAmount = remainingAmount % denomination;
      }
    }

    return {
      breakdown: result,
      totalNotes: result.reduce((sum, note) => sum + note.count, 0),
      isValid: remainingAmount === 0,
    };
  };

  const validateAmount = (amount) => {
    if (!amount || amount <= 0) {
      return "Please enter a valid amount";
    }
    if (amount < 10) {
      return "Minimum withdrawal amount is ₹10";
    }
    if (amount % 10 !== 0) {
      return "Amount must be a multiple of ₹10";
    }
    if (amount > 100000) {
      return "Maximum withdrawal limit is ₹100,000";
    }
    return null;
  };

  const handleCalculate = () => {
    const amount = parseInt(withdrawalAmount);
    const validationErrorMsg = validateAmount(amount);

    if (validationErrorMsg) {
      setValidationError(validationErrorMsg);
      return;
    }

    setValidationError("");
    const calculation = calculateMinimumNotes(amount);

    if (!calculation.isValid) {
      setValidationError(
        "Cannot dispense exact amount with available denominations"
      );
      return;
    }

    setCalculationResult(calculation);
    setShowResults(true);
  };

  const handleClear = () => {
    setWithdrawalAmount("");
    setValidationError("");
    setShowResults(false);
    setCalculationResult(null);
  };

  const handleQuickAmount = (amount) => {
    setWithdrawalAmount(amount.toString());
    setValidationError("");
  };

  const handleNewTransaction = () => {
    handleClear();
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mb: 1,
        }}
      >
        <AccountBalanceIcon
          sx={{ fontSize: 40, color: "primary.main" }}
          aria-label="ATM Icon"
        />
        <Typography
          variant="h4"
          sx={{ color: "primary.main", fontWeight: 500 }}
        >
          ATM Simulator
        </Typography>
      </Box>
      <Card sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
        <CardContent
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 2,
            borderRadius: 1,
            mb: 3,
          }}
        >
          <Typography variant="h6" textAlign="center">
            Cash Withdrawal
          </Typography>
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.9 }}>
            Available denominations: ₹10, ₹20, ₹50, ₹100, ₹500, ₹2000
          </Typography>
        </CardContent>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={500} mb={1}>
            Withdrawal Amount
          </Typography>
          <TextField
            id="withdrawalAmount"
            type="number"
            fullWidth
            placeholder="Enter amount"
            InputProps={{
              startAdornment: (
                <Typography sx={{ pr: 1, color: "text.secondary" }}>
                  ₹
                </Typography>
              ),
            }}
            value={withdrawalAmount}
            onChange={(e) => {
              setWithdrawalAmount(e.target.value);
              if (e.target.value && validationError) {
                setValidationError("");
              }
            }}
            error={!!validationError}
            helperText={validationError}
            inputProps={{ min: 10, step: 10 }}
          />
        </Box>

        <Stack direction="row" spacing={2} mb={3}>
          <Button
            variant="contained"
            onClick={handleCalculate}
            fullWidth
            sx={{ flex: 1 }}
          >
            Calculate
          </Button>
          <Button variant="outlined" onClick={handleClear}>
            Clear
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" mb={1.5}>
          Quick amounts:
        </Typography>
        <Grid container spacing={1}>
          {QUICK_AMOUNTS.map((amount) => (
            <Grid item xs={4} key={amount}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleQuickAmount(amount)}
                sx={{ fontSize: "0.75rem", py: 1 }}
              >
                ₹{amount.toLocaleString()}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Card>

      {showResults && calculationResult && (
        <Card sx={{ maxWidth: 600, mx: "auto", p: 3, mt: 3 }}>
          <CardContent
            sx={{
              bgcolor: "success.main",
              color: "white",
              p: 2,
              borderRadius: 1,
              mb: 3,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                bgcolor: "white",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="subtitle2" fontWeight={500}>
              Transaction Successful
            </Typography>
          </CardContent>

          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Amount Withdrawn
            </Typography>
            <Typography variant="h5" fontWeight={500}>
              ₹{parseInt(withdrawalAmount).toLocaleString()}
            </Typography>

            <DenominationChip
              label={`Optimal Solution : ${calculationResult.totalNotes} Notes used`}
            />
          </Box>

          <Typography variant="subtitle1" fontWeight={500} mb={2}>
            Note Breakdown
          </Typography>
          {calculationResult.breakdown.map((note) => (
            <Box
              key={note.denomination}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                p: 1,
                bgcolor: "#faf8dc",
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DenominationChip
                  label={`₹${note.denomination}`}
                  backgroundColor="#ff9a8b"
                />
                <Typography variant="body2" color="text.secondary" ml={1.5}>
                  ₹{note.denomination} notes
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="subtitle2" fontWeight={500}>
                  {note.count}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ₹{note.total.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          ))}

          <Button
            variant="contained"
            onClick={handleNewTransaction}
            fullWidth
            sx={{
              mt: 2,
            }}
          >
            New Transaction
          </Button>
        </Card>
      )}
    </Box>
  );
}

export default CashWithdrawalCard;
