BEGIN{FS="\t"}
{a += $(NF-1)};
{x[NR] = $(NF-1)};
END{avg = a/(NR-1)}
END{print "mean: ", avg}
END{for(i=1;i<NR;i++){
	x[i] = (x[i]-avg)^2
		b += x[i]
	}
}
END{std = b/(NR-1)}
END{stddev = sqrt(std)}
END{print "standard deviation: ", stddev}
	
