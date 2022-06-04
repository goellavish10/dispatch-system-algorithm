module.exports = {
  writeSuburbToDatabase: async (req, res) => {
    try {
      const suburbData = req.body;
      for (let i = 0; i < suburbData.length; i++) {
        const suburb = suburbData[i];
        const {
          name,
          urban_area,
          state_code,
          state,
          postcode,
          type,
          latitude,
          longitude,
          elevation,
          population,
          area_sq_km,
          region,
          time_zone,
          local_government_area,
          median_income,
        } = suburb;
        const newSuburbData = {
          name,
          urban_area,
          state_code,
          state,
          postcode,
          type,
          latitude,
          longitude,
          elevation,
          population,
          area_sq_km,
          region,
          time_zone,
          local_government_area,
          median_income,
        };
        const newSuburb = new SuburbCoordinate(newSuburbData);

        await newSuburb.save();
      }
      res.json({ msg: "Suburb written to database!" });
    } catch (err) {
      console.log(err);
      res.json({ msg: err });
    }
  },
};
