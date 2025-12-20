
      const token = localStorage.getItem("accessToken");

      if (!token) {
        window.location.href = "/signin";
      }

      fetch("/api/users/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized");
          return res.json();
        })
        .then((data) => {
          const role = data.user.role?.toLowerCase();
          if (role !== "receptionist") {
            window.location.href = "/403.html";
          }
         
        })
        .catch(() => {
          window.location.href = "/signin";
        });
