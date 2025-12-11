// ... existing imports and middleware ...

// Connect to DB (Call it outside routes)
connectDB();

// ... existing routes ...

app.get('/', (req, res) => {
    res.send('Doctor Appointment API Running...');
});

// VERCEL EXPORT (Crucial)
// We only listen to port if NOT running on Vercel
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;