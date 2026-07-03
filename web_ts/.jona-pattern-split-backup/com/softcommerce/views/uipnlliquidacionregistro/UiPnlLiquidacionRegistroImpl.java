package com.softcommerce.views.uipnlliquidacionregistro;

import com.softcommerce.beans.BeanCajaSerie;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.BeanTipoCambio;
import com.softcommerce.beans.ContaDet;
import com.softcommerce.beans.Liquidacion;
import com.softcommerce.beans.RegContaCab;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.formularios.*;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.reglasnegocio.RnCajaSerie;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnLiquidacion;
import com.softcommerce.reglasnegocio.RnTipoCambio;
import com.softcommerce.reglasnegocio.RnUsuario;
import com.softcommerce.report.reporte_v3;
import com.softcommerce.tablemodel.TableModelDocumentoSinLiquidar;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.render.CellRenderer;
import com.softcommerce.util.Util;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.Font;
import java.math.BigDecimal;
import java.net.URL;
import java.sql.SQLException;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import javax.swing.border.TitledBorder;
import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JFormattedTextField;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import javax.swing.text.DefaultFormatterFactory;
import javax.swing.text.NumberFormatter;
import org.apache.log4j.Logger;
import org.jdesktop.swingx.JXDatePicker;

public class UiPnlLiquidacionRegistroImpl extends UiPnlLiquidacionRegistro {

    public UiPnlLiquidacionRegistroImpl(URL path, Usuario user, Main frm) {
        super(path, user, frm);
    }
}
